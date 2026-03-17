/**
 * Keycloak Token Service
 * Validates JWT tokens issued by Keycloak
 */

import { BaseService, inject, TContext } from '@venizia/ignis';
import { getError, HTTP } from '@venizia/ignis-helpers';
import { Env } from 'hono';
import { jwtVerify, JWTPayload, createRemoteJWKSet } from 'jose';
import { Authentication, IAuthUser } from '@venizia/ignis';
import { env } from '../config/env.config';
import { BindingKeys } from '../constants';

export interface IKeycloakTokenServiceOptions {
  keycloakUrl: string;
  realm: string;
  clientId?: string;
}

export interface IKeycloakTokenPayload extends JWTPayload {
  sub: string; // User ID
  email?: string;
  preferred_username?: string;
  name?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: {
    [clientId: string]: {
      roles?: string[];
    };
  };
  [key: string]: any;
}

export class KeycloakTokenService<E extends Env = Env> extends BaseService {
  private jwksUrl: string;
  private jwks: ReturnType<typeof createRemoteJWKSet>;
  private options: IKeycloakTokenServiceOptions;

  constructor(
    @inject({ key: BindingKeys.KEYCLOAK_TOKEN_SERVICE_OPTIONS })
    options: IKeycloakTokenServiceOptions,
  ) {
    super({ scope: KeycloakTokenService.name });

    const { keycloakUrl, realm } = options;

    if (!keycloakUrl || !realm) {
      throw getError({
        statusCode: HTTP.ResultCodes.RS_5.InternalServerError,
        message: '[KeycloakTokenService] keycloakUrl and realm are required',
      });
    }

    this.options = options;

    // Construct JWKS URL: {keycloakUrl}/realms/{realm}/protocol/openid-connect/certs
    this.jwksUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`;
    
    // JWKS is cached by jose library internally (createRemoteJWKSet handles caching)
    this.jwks = createRemoteJWKSet(new URL(this.jwksUrl));

    this.logger.info(`Initialized with JWKS URL: ${this.jwksUrl}`);
  }

  /**
   * Extract Bearer token from Authorization header
   */
  extractCredentials(context: TContext<E, string>): { type: string; token: string } {
    const request = context.req;

    const authHeaderValue = request.header('Authorization');
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
   * Verify and decode Keycloak JWT token
   */
  async verify(token: string): Promise<IAuthUser> {
    try {
      // Log token info in development
      const expectedIssuer = `${this.options.keycloakUrl}/realms/${this.options.realm}`;
      
      if (env.APP_ENV_NODE_ENV === 'development') {
        const tokenInfo = {
          tokenLength: token.length,
          tokenPrefix: token.substring(0, 20) + '...',
          issuer: expectedIssuer,
          keycloakUrl: this.options.keycloakUrl,
          realm: this.options.realm,
          clientId: this.options.clientId,
          jwksUrl: this.jwksUrl,
        };
        this.logger.info(`Verifying token: ${JSON.stringify(tokenInfo, null, 2)}`);
      }

      // Verify token signature using JWKS (Keycloak's public keys)
      if (env.APP_ENV_NODE_ENV === 'development') {
        const verificationInfo = {
          expectedIssuer,
          jwksUrl: this.jwksUrl,
        };
        this.logger.info(`Attempting JWT verification: ${JSON.stringify(verificationInfo, null, 2)}`);
      }
      
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: expectedIssuer,
      });

      const keycloakPayload = payload as IKeycloakTokenPayload;

      // Log payload for debugging (only in development)
      if (env.APP_ENV_NODE_ENV === 'development') {
        const payloadInfo = {
          payloadKeys: Object.keys(keycloakPayload),
          hasSub: !!keycloakPayload.sub,
          sub: keycloakPayload.sub,
          fullPayload: JSON.stringify(keycloakPayload, null, 2),
        };
        this.logger.info(`Token payload: ${JSON.stringify(payloadInfo, null, 2)}`);
      }

      // Extract user information
      // Keycloak tokens should have 'sub' field, but use fallback if not present
      let userId = keycloakPayload.sub;
      
      // Fallback: try other fields if sub is missing
      if (!userId) {
        // Try preferred_username, email, or name as fallback
        userId = keycloakPayload.preferred_username || 
                 keycloakPayload.email || 
                 keycloakPayload.name ||
                 (keycloakPayload as any).user_id ||
                 (keycloakPayload as any).userId;
      }
      
      if (!userId) {
        // Log full payload for debugging
        this.logger.error('Token missing user identifier', {
          payload: JSON.stringify(keycloakPayload, null, 2),
          availableFields: Object.keys(keycloakPayload),
        });
        throw getError({
          statusCode: HTTP.ResultCodes.RS_4.Unauthorized,
          message: 'Invalid token: missing user identifier (sub, preferred_username, email, or name)',
        });
      }

      // Extract roles from Keycloak token
      // Keycloak tokens have roles in realm_access.roles or resource_access[clientId].roles
      const roles: { id: string; identifier: string; priority: number }[] = [];
      
      // Realm-level roles
      if (keycloakPayload.realm_access?.roles && Array.isArray(keycloakPayload.realm_access.roles)) {
        keycloakPayload.realm_access.roles.forEach((role, index) => {
          roles.push({
            id: role,
            identifier: role,
            priority: index,
          });
        });
      }
      
      // Client-level roles
      if (this.options.clientId && keycloakPayload.resource_access?.[this.options.clientId]?.roles) {
        const clientRoles = keycloakPayload.resource_access[this.options.clientId].roles || [];
        clientRoles.forEach((role, index) => {
          // Avoid duplicates
          if (!roles.find(r => r.id === role)) {
            roles.push({
              id: role,
              identifier: role,
              priority: index + (keycloakPayload.realm_access?.roles?.length || 0),
            });
          }
        });
      }

      // Return IAuthUser compatible object
      return {
        userId,
        email: keycloakPayload.email,
        username: keycloakPayload.preferred_username,
        name: keycloakPayload.name,
        roles,
        // Include all Keycloak payload data for access in controllers
        ...keycloakPayload,
      };
    } catch (error: any) {
      // Log detailed error information
      const errorDetails: any = {
        errorCode: error.code,
        errorMessage: error.message,
        errorName: error.name,
        jwksUrl: this.jwksUrl,
        keycloakUrl: this.options.keycloakUrl,
        realm: this.options.realm,
        clientId: this.options.clientId,
      };

      // Add stack trace in development
      if (env.APP_ENV_NODE_ENV === 'development') {
        errorDetails.stack = error.stack;
        errorDetails.fullError = error;
      }

      this.logger.error(`Token verification error: ${JSON.stringify(errorDetails, null, 2)}`);

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
      if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        throw getError({
          statusCode: HTTP.ResultCodes.RS_4.Unauthorized,
          message: 'Token signature verification failed - token may not be from Keycloak',
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
}

