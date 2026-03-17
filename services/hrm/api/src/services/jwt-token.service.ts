/**
 * JWT Token Service
 * Validates JWT tokens using secret key
 */

import { BaseService, inject, TContext } from '@venizia/ignis';
import { getError, HTTP } from '@venizia/ignis-helpers';
import { Env } from 'hono';
import { jwtVerify, JWTPayload, SignJWT } from 'jose';
import { Authentication, IAuthUser } from '@venizia/ignis';
import { env } from '../config/env.config';
import { BindingKeys } from '../constants';

export interface IJwtTokenServiceOptions {
  secret: string; // JWT secret key
  issuer?: string; // Token issuer
  audience?: string; // Token audience
}

export interface IJwtTokenPayload extends JWTPayload {
  sub: string; // User ID
  email?: string;
  username?: string;
  name?: string;
  roles?: string[];
  [key: string]: any;
}

export class JwtTokenService<E extends Env = Env> extends BaseService {
  private secret: Uint8Array;
  private options: IJwtTokenServiceOptions;

  constructor(
    @inject({ key: BindingKeys.JWT_TOKEN_SERVICE_OPTIONS })
    options: IJwtTokenServiceOptions,
  ) {
    super({ scope: JwtTokenService.name });

    if (!options.secret) {
      throw getError({
        statusCode: HTTP.ResultCodes.RS_5.InternalServerError,
        message: '[JwtTokenService] secret is required',
      });
    }

    this.options = options;
    // Convert secret string to Uint8Array for jose library
    this.secret = new TextEncoder().encode(options.secret);

    this.logger.info('[JwtTokenService] Initialized');
  }

  /**
   * Extract Bearer token from Authorization header
   */
  extractCredentials(context: TContext<E, string>): { type: string; token: string } {
    const request = context.req;

    const authHeaderValue = request.header('Authorization');
    
    // Log in development to debug missing header
    if (env.APP_ENV_NODE_ENV === 'development') {
      this.logger.debug('[JwtTokenService] Extracting credentials', {
        hasAuthHeader: !!authHeaderValue,
        authHeaderPrefix: authHeaderValue?.substring(0, 30) || 'none',
        path: request.path,
        method: request.method,
        url: request.url,
      });
    }
    
    if (!authHeaderValue) {
      throw getError({
        statusCode: HTTP.ResultCodes.RS_4.Unauthorized,
        message: 'Unauthorized user! Missing authorization header',
      });
    }

    if (!authHeaderValue.startsWith(Authentication.TYPE_BEARER)) {
      throw getError({
        statusCode: HTTP.ResultCodes.RS_4.Unauthorized,
        message: 'Unauthorized user! Invalid schema of request token!',
      });
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw getError({
        statusCode: HTTP.ResultCodes.RS_4.Unauthorized,
        message: `Authorization header value is invalid format. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      });
    }

    const [tokenType, tokenValue] = parts;
    return { type: tokenType, token: tokenValue };
  }

  /**
   * Verify and decode JWT token
   */
  async verify(token: string): Promise<IAuthUser> {
    try {
      // Log token info in development
      if (env.APP_ENV_NODE_ENV === 'development') {
        this.logger.info('[JwtTokenService] Verifying token', {
          tokenLength: token.length,
          tokenPrefix: token.substring(0, 20) + '...',
        });
      }

      // Verify token signature
      const verifyOptions: any = {};
      if (this.options.issuer) {
        verifyOptions.issuer = this.options.issuer;
      }
      if (this.options.audience) {
        verifyOptions.audience = this.options.audience;
      }

      const { payload } = await jwtVerify(token, this.secret, verifyOptions);

      const jwtPayload = payload as IJwtTokenPayload;

      // Log payload for debugging (only in development)
      if (env.APP_ENV_NODE_ENV === 'development') {
        this.logger.info('[JwtTokenService] Token payload', {
          payloadKeys: Object.keys(jwtPayload),
          hasSub: !!jwtPayload.sub,
          sub: jwtPayload.sub,
        });
      }

      // Extract user information
      const userId = jwtPayload.sub;
      if (!userId) {
        if (env.APP_ENV_NODE_ENV === 'development') {
          this.logger.error('[JwtTokenService] Token missing sub field', {
            payload: JSON.stringify(jwtPayload, null, 2),
            availableFields: Object.keys(jwtPayload),
          });
        }
        throw getError({
          statusCode: HTTP.ResultCodes.RS_4.Unauthorized,
          message: 'Invalid token: missing user ID (sub)',
        });
      }

      // Extract roles
      const roles: { id: string; identifier: string; priority: number }[] = [];
      if (jwtPayload.roles && Array.isArray(jwtPayload.roles)) {
        jwtPayload.roles.forEach((role, index) => {
          roles.push({
            id: role,
            identifier: role,
            priority: index,
          });
        });
      }

      // Return IAuthUser compatible object
      return {
        userId,
        email: jwtPayload.email,
        username: jwtPayload.username,
        name: jwtPayload.name,
        roles,
        // Include all JWT payload data for access in controllers
        ...jwtPayload,
      };
    } catch (error: any) {
      // Log error details in development
      if (env.APP_ENV_NODE_ENV === 'development') {
        this.logger.error('[JwtTokenService] Token verification error', {
          errorCode: error.code,
          errorMessage: error.message,
          errorName: error.name,
        });
      }

      if (error.code === 'ERR_JWT_EXPIRED') {
        throw getError({
          statusCode: HTTP.ResultCodes.RS_4.Unauthorized,
          message: 'Token has expired',
        });
      }
      if (error.code === 'ERR_JWT_INVALID') {
        throw getError({
          statusCode: HTTP.ResultCodes.RS_4.Unauthorized,
          message: 'Invalid token',
        });
      }
      // Re-throw if it's already an AppError
      if (error.statusCode) {
        throw error;
      }
      throw getError({
        statusCode: HTTP.ResultCodes.RS_4.Unauthorized,
        message: `Token verification failed: ${error.message}`,
      });
    }
  }

  /**
   * Generate JWT token
   */
  async generate(payload: IJwtTokenPayload, expiresIn: string = '1h'): Promise<string> {
    const jwt = new SignJWT(payload as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn);

    if (this.options.issuer) {
      jwt.setIssuer(this.options.issuer);
    }
    if (this.options.audience) {
      jwt.setAudience(this.options.audience);
    }

    return await jwt.sign(this.secret);
  }
}

