/**
 * Authentication Service
 *
 * - REST POST /api/auth/exchange (from Remote UI): exchangeToken() → Shell AuthGateway → Shell calls Hrm gRPC.
 * - gRPC AuthService/ExchangeToken (from Shell): exchangeTokenFromKeycloak() → local Keycloak verify + JWT issue (no Shell call).
 * - REST POST /api/auth/login: login() → Shell local-login.
 * - REST POST /api/auth/request-password-reset: requestPasswordReset() → Shell request-password-reset.
 * - REST POST /api/auth/confirm-password-reset: confirmPasswordReset() → Shell confirm-password-reset.
 */

import { BaseService, inject } from '@venizia/ignis';
import { KeycloakTokenService } from './keycloak-token.service';
import { JwtTokenService } from './jwt-token.service';
import { ShellAuthGatewayClientService } from './shell-auth-gateway.client';
import { AppError, ErrorCode } from '../errors/app.errors';

export interface TokenExchangeResult {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface UserInfo {
  userId: string;
  email: string;
  organizationId: string;
  roles: string[];
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export class AuthService extends BaseService {
  constructor(
    @inject({ key: 'services.KeycloakTokenService' })
    private keycloakTokenService: KeycloakTokenService,
    @inject({ key: 'services.JwtTokenService' })
    private jwtTokenService: JwtTokenService,
    @inject({ key: 'services.ShellAuthGatewayClientService' })
    private shellAuthGateway: ShellAuthGatewayClientService,
  ) {
    super({ scope: AuthService.name });
  }

  /**
   * Exchange Keycloak token for service JWT via Shell AuthGateway.
   * Used only by REST POST /api/auth/exchange (Remote UI → Hrm API → Shell → Hrm gRPC).
   */
  async exchangeToken(request: { keycloakToken: string } | string): Promise<TokenExchangeResult> {
    const keycloakToken = typeof request === 'string' ? request : request.keycloakToken;
    return this.shellAuthGateway.exchangeForService(keycloakToken);
  }

  /**
   * Exchange Keycloak token for Hrm JWT locally (verify Keycloak + issue JWT).
   * Used only by gRPC AuthService/ExchangeToken when Shell calls Hrm. Do not call Shell from here.
   */
  async exchangeTokenFromKeycloak(keycloakToken: string): Promise<TokenExchangeResult> {
    const tokenUser = await this.keycloakTokenService.verify(keycloakToken);
    const userId = String(tokenUser.userId ?? (tokenUser as { sub?: string }).sub ?? '');
    const organizationId = String(
      (tokenUser as { organizationId?: string }).organizationId ??
        (tokenUser as { organization_id?: string }).organization_id ??
        '',
    );
    const roles: string[] = Array.isArray(tokenUser.roles)
      ? (tokenUser.roles as { identifier?: string }[]).map((r) =>
          typeof r === 'string' ? r : (r as { identifier?: string }).identifier ?? '',
        )
      : [];

    const serviceJwtToken = await this.jwtTokenService.generate(
      {
        sub: userId,
        email: tokenUser.email,
        username: tokenUser.username,
        name: tokenUser.name,
        organizationId,
        roles,
      },
      '1h',
    );

    return {
      access_token: serviceJwtToken,
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }

  /**
   * Verify a service JWT and return user info from the token payload.
   */
  async verifyToken(token: string): Promise<UserInfo> {
    const payload = await this.jwtTokenService.verify(token);
    const roles = (payload.roles ?? []).map((r: { identifier?: string }) =>
      typeof r === 'string' ? r : r.identifier ?? '',
    );
    return {
      userId: String(payload.userId ?? ''),
      email: payload.email ?? '',
      organizationId: (payload as { organizationId?: string }).organizationId ?? '',
      roles,
    };
  }

  /**
   * Login with email and password.
   * Proxies to Shell API POST /api/auth/local-login.
   */
  async login(email: string, password: string): Promise<LoginResult> {
    const shellBaseUrl = this.getShellRestUrl();

    const res = await fetch(`${shellBaseUrl}/auth/local-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: email, password }),
      signal: AbortSignal.timeout(10_000),
    }).catch((err: Error) => {
      this.logger.error('[AuthService] Shell API unreachable for login', { error: err.message });
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Authentication service unavailable', 502);
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null) as { error?: { message?: string }; message?: string } | null;
      const message = body?.error?.message || body?.message || 'Invalid email or password';
      throw new AppError(ErrorCode.AUTHENTICATION_ERROR, message, 401);
    }

    const body = await res.json() as {
      data?: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
        user: { id: string; email: string; username: string; name?: string };
      };
    };

    const data = body.data;
    if (!data?.accessToken) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Invalid response from auth service', 502);
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      tokenType: data.tokenType,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.username,
      },
    };
  }

  /**
   * Request password reset (forgot password).
   * Proxies to Shell API POST /api/auth/request-password-reset.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const shellBaseUrl = this.getShellRestUrl();

    const res = await fetch(`${shellBaseUrl}/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(10_000),
    }).catch((err: Error) => {
      this.logger.error('[AuthService] Shell API unreachable for password reset', { error: err.message });
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Password reset service unavailable', 502);
    });

    if (!res.ok && res.status !== 204) {
      const body = await res.json().catch(() => null) as { error?: { message?: string } } | null;
      const message = body?.error?.message || 'Failed to request password reset';
      throw new AppError(ErrorCode.BAD_REQUEST, message, res.status >= 500 ? 502 : 400);
    }
  }

  /**
   * Confirm password reset with token.
   * Proxies to Shell API POST /api/auth/confirm-password-reset.
   */
  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    const shellBaseUrl = this.getShellRestUrl();

    const res = await fetch(`${shellBaseUrl}/auth/confirm-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
      signal: AbortSignal.timeout(10_000),
    }).catch((err: Error) => {
      this.logger.error('[AuthService] Shell API unreachable for password reset confirm', { error: err.message });
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Password reset service unavailable', 502);
    });

    if (!res.ok && res.status !== 204) {
      const body = await res.json().catch(() => null) as { error?: { message?: string } } | null;
      const message = body?.error?.message || 'Failed to confirm password reset';
      throw new AppError(ErrorCode.BAD_REQUEST, message, res.status >= 500 ? 502 : 400);
    }
  }

  /**
   * Get Shell REST API base URL (derived from gRPC URL config).
   */
  private getShellRestUrl(): string {
    // The Shell gRPC URL and REST URL share the same base (e.g., http://localhost:3000/api)
    return (this.shellAuthGateway as any).shellGrpcBaseUrl || 'http://localhost:3000/api';
  }
}
