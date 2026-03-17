/**
 * Keycloak Authentication Strategy
 * Uses KeycloakTokenService to verify Keycloak-issued tokens
 */

import { inject, TContext } from '@venizia/ignis';
import { BaseHelper } from '@venizia/ignis-helpers';
import { Env } from 'hono';
import { IAuthUser, IAuthenticationStrategy } from '@venizia/ignis';
import { KeycloakTokenService } from '../services/keycloak-token.service';
import { env } from '../config/env.config';

export class KeycloakAuthenticationStrategy<
  E extends Env = Env
> extends BaseHelper
  implements IAuthenticationStrategy<E>
{
  name = 'keycloak';

  constructor(
    @inject({ key: 'services.KeycloakTokenService' })
    private service: KeycloakTokenService<E>,
  ) {
    super({ scope: KeycloakAuthenticationStrategy.name });
  }

  async authenticate(context: TContext<E, string>): Promise<IAuthUser> {
    try {
      const { token } = this.service.extractCredentials(context);
      
      // Verify token using KeycloakTokenService (uses JWKS from Keycloak)
      return await this.service.verify(token);
    } catch (error: any) {
      // Log authentication failure for debugging
      if (env.APP_ENV_NODE_ENV === 'development') {
        this.logger.error('Authentication failed', {
          error: error.message,
          statusCode: error.statusCode,
          path: context.req.path,
          method: context.req.method,
        });
      }
      throw error;
    }
  }
}
