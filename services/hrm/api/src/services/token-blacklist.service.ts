/**
 * Token Blacklist Service
 * Manages blacklisted tokens for logout functionality
 */

import { createHash } from 'crypto';
import { inject } from '@venizia/ignis';
import { BaseService } from '@venizia/ignis';
import { CacheService } from './cache.service';

export class TokenBlacklistService extends BaseService {
  constructor(
    @inject({ key: 'services.CacheService' })
    private cache: CacheService,
  ) {
    super({ scope: TokenBlacklistService.name });
  }

  /**
   * Blacklist a token until it expires
   * @param token - JWT token to blacklist
   * @param expiresIn - Token expiration time in seconds
   */
  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    const key = this.getBlacklistKey(token);
    // Store token hash in blacklist until it expires
    // Add 60 seconds buffer to ensure token is blacklisted even after expiry
    await this.cache.set(key, true, expiresIn + 60);
    this.logger.info(`[TokenBlacklistService] Token blacklisted: ${key.substring(0, 20)}...`);
  }

  /**
   * Check if token is blacklisted
   * @param token - JWT token to check
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = this.getBlacklistKey(token);
    const blacklisted = await this.cache.exists(key);
    return blacklisted;
  }

  /**
   * Remove token from blacklist (for testing/admin purposes)
   * @param token - JWT token to remove from blacklist
   */
  async removeFromBlacklist(token: string): Promise<void> {
    const key = this.getBlacklistKey(token);
    await this.cache.delete(key);
  }

  /**
   * Get blacklist cache key for token
   * Uses SHA-256 hash of full token to avoid key collisions
   */
  private getBlacklistKey(token: string): string {
    const hash = createHash('sha256').update(token).digest('hex').substring(0, 32);
    return `blacklist:token:${hash}`;
  }
}

