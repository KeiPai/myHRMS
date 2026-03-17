/**
 * gRPC Connect handler for AuthService
 * Mount at /auth.v1.AuthService/* for Shell token exchange
 */

import { createConnectRouter } from '@connectrpc/connect';
import {
  universalServerRequestFromFetch,
  universalServerResponseToFetch,
} from '@connectrpc/connect/protocol';
import type { MiddlewareHandler } from 'hono';
import type { AuthService } from '../services/auth.service';
import { registerAuthService } from './auth-service.impl';

export interface GrpcHandlerOptions {
  basePath?: string;
}

export function createGrpcHandler(
  authService: AuthService,
  options?: GrpcHandlerOptions,
): MiddlewareHandler {
  const router = createConnectRouter();
  registerAuthService(router, authService);

  const handlers = router.handlers;
  const basePath = options?.basePath?.replace(/\/$/, '') ?? '';

  return async (c, next) => {
    const url = new URL(c.req.url);
    let pathname = url.pathname;
    if (basePath && pathname.startsWith(basePath + '/')) {
      pathname = pathname.slice(basePath.length) || '/';
    }

    for (const handler of handlers) {
      if (pathname === handler.requestPath) {
        const headers: any = new Headers(c.req.raw.headers);
        headers.delete('content-length');
        headers.delete('Content-Length');

        let fetchReq: any;
        const contentType = c.req.header('content-type') ?? '';
        if (contentType.startsWith('application/json')) {
          let json: unknown = null;
          try {
            json = await c.req.json();
          } catch {
            json = null;
          }
          fetchReq = new Request(c.req.url, {
            method: c.req.method,
            headers,
            body: json !== null ? JSON.stringify(json) : undefined,
          });
        } else {
          fetchReq = new Request(c.req.url, {
            method: c.req.method,
            headers,
          });
        }

        const uReq = universalServerRequestFromFetch(fetchReq as any, {
          httpVersion: '1.1',
        });
        const uRes = await handler(uReq);
        return universalServerResponseToFetch(uRes);
      }
    }

    return next();
  };
}
