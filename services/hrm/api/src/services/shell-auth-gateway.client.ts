/**
 * Client for Shell API AuthGateway.ExchangeForService (gRPC Connect)
 * Used by Hrm API to exchange Keycloak token for service JWT via Shell.
 * Flow: Remote UI → Hrm API REST → Shell API gRPC → Hrm gRPC AuthService/ExchangeToken
 */

import { BaseService, inject } from '@venizia/ignis';

const SERVICE_ID = 'hrm';
const SHELL_GATEWAY_TIMEOUT_MS = 10_000;

export interface ShellAuthGatewayClientOptions {
  shellGrpcBaseUrl: string;
}

/**
 * Shell AuthGateway client (Connect JSON over HTTP)
 */
export class ShellAuthGatewayClientService extends BaseService {
  constructor(
    @inject({ key: 'shellAuthGatewayClientOptions' })
    options: ShellAuthGatewayClientOptions,
  ) {
    super({ scope: ShellAuthGatewayClientService.name });
    this.shellGrpcBaseUrl = options.shellGrpcBaseUrl;
  }

  private readonly shellGrpcBaseUrl: string;

  /**
   * Exchange Keycloak token for service JWT via Shell AuthGateway
   */
  async exchangeForService(keycloakToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const url = `${this.shellGrpcBaseUrl}/auth.v1.AuthGateway/ExchangeForService`;

    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keycloakToken,
          serviceId: SERVICE_ID,
        }),
        signal: AbortSignal.timeout(SHELL_GATEWAY_TIMEOUT_MS),
      });
    } catch (fetchErr: any) {
      if (fetchErr.name === 'TimeoutError' || fetchErr.name === 'AbortError') {
        this.logger.error(`[ShellAuthGatewayClient] Shell AuthGateway timed out after ${SHELL_GATEWAY_TIMEOUT_MS}ms`);
        const err = new Error('Shell AuthGateway timed out');
        (err as Error & { statusCode?: number }).statusCode = 504;
        throw err;
      }
      this.logger.error('[ShellAuthGatewayClient] Network error calling Shell AuthGateway', {
        error: fetchErr.message,
      });
      const err = new Error(`Shell AuthGateway unreachable: ${fetchErr.message}`);
      (err as Error & { statusCode?: number }).statusCode = 502;
      throw err;
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      this.logger.error('[ShellAuthGatewayClient] ExchangeForService failed', {
        status: res.status,
        body: text,
      });
      const err = new Error(`Shell AuthGateway error: ${res.status}`);
      (err as Error & { statusCode?: number }).statusCode = res.status;
      throw err;
    }

    const body = (await res.json()) as {
      accessToken?: string;
      access_token?: string;
      tokenType?: string;
      token_type?: string;
      expiresIn?: number;
      expires_in?: number;
    };

    return {
      access_token: body.accessToken ?? body.access_token ?? '',
      token_type: body.tokenType ?? body.token_type ?? 'Bearer',
      expires_in: body.expiresIn ?? body.expires_in ?? 0,
    };
  }
}
