/**
 * gRPC AuthService implementation (Connect RPC)
 * Used when Shell calls Hrm's ExchangeToken. Do NOT call Shell from here.
 */

import { ConnectError, Code } from '@connectrpc/connect';
import type { ConnectRouter } from '@connectrpc/connect';
import { AuthService as AuthServiceDef } from '../grpc-contracts/gen/auth/v1/auth_connect.js';
import {
  ExchangeTokenRequest,
  ExchangeTokenResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from '../grpc-contracts/gen/auth/v1/auth_pb.js';
import type { AuthService } from '../services/auth.service';
import { createRequestLogger } from '../utils/logger';

export function registerAuthService(router: ConnectRouter, authService: AuthService): void {
  const logger = createRequestLogger('gRPC:AuthService');

  router.service(AuthServiceDef as any, {
    async exchangeToken(req: ExchangeTokenRequest) {
      try {
        const result = await authService.exchangeTokenFromKeycloak(req.token);
        return new ExchangeTokenResponse({
          accessToken: result.access_token,
          tokenType: result.token_type,
          expiresIn: result.expires_in,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes('verification failed') || /(?:^|\s)(invalid|expired)(?:\s|$)/i.test(message)) {
          throw new ConnectError(message, Code.Unauthenticated);
        }
        logger.error('ExchangeToken failed', err instanceof Error ? err : { error: String(err) });
        throw new ConnectError('Token exchange failed.', Code.Internal);
      }
    },

    async verifyToken(req: VerifyTokenRequest) {
      try {
        const result = await authService.verifyToken(req.token);
        return new VerifyTokenResponse({
          userId: result.userId,
          email: result.email,
          organizationId: result.organizationId,
          roles: result.roles,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes('not found') || message.includes('expired') || message.includes('invalid')) {
          throw new ConnectError(message, Code.Unauthenticated);
        }
        throw ConnectError.from(err as Error, Code.Internal);
      }
    },
  } as any);
}
