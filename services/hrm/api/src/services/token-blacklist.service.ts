/**
 * Token Blacklist Service
 * Manages blacklisted tokens for logout functionality
 */

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
   * Uses first 20 chars of token as key (for privacy)
   */
  private getBlacklistKey(token: string): string {
    // Use a hash or first part of token as key
    // In production, consider using a proper hash function
    const tokenPrefix = token.substring(0, 20);
    return `blacklist:token:${tokenPrefix}`;
  }
}

