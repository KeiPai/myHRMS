/**
 * JWT Authentication Strategy
 * Implements IAuthenticationStrategy for JWT token validation
 */

import { inject, TContext } from '@venizia/ignis';
import { BaseHelper } from '@venizia/ignis-helpers';
import { Env } from 'hono';
import { IAuthUser, IAuthenticationStrategy } from '@venizia/ignis';
import { JwtTokenService } from '../services/jwt-token.service';
import { TokenBlacklistService } from '../services/token-blacklist.service';
import { AuthenticationError } from '../errors/app.errors';

export class JwtAuthenticationStrategy<
  E extends Env = Env
> extends BaseHelper
  implements IAuthenticationStrategy<E>
{
  name = 'jwt';

  constructor(
    @inject({ key: 'services.JwtTokenService' })
    private service: JwtTokenService<E>,
    @inject({ key: 'services.TokenBlacklistService' })
    private tokenBlacklist: TokenBlacklistService,
  ) {
    super({ scope: JwtAuthenticationStrategy.name });
  }

  async authenticate(context: TContext<E, string>): Promise<IAuthUser> {
    try {
      const { token } = this.service.extractCredentials(context);
      
      // Check if token is blacklisted
      const isBlacklisted = await this.tokenBlacklist.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new AuthenticationError('Token has been revoked');
      }
      
      // Verify token
      return await this.service.verify(token);
    } catch (error: any) {
      // Re-throw error (logging is handled by error middleware)
      throw error;
    }
  }
}

