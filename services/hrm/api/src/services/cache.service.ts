/**
 * Cache Service
 * Redis-based caching service for service registry and other data
 */

import { inject } from '@venizia/ignis';
import { BaseService } from '@venizia/ignis';

export interface ICacheServiceOptions {
  redisUrl?: string;
  defaultTtl?: number; // Default TTL in seconds
}

export class CacheService extends BaseService {
  private cache: Map<string, { value: any; expiresAt: number }> = new Map();
  private defaultTtl: number;

  constructor(
    @inject({ key: 'services.CacheService.options' })
    options: ICacheServiceOptions = {},
  ) {
    super({ scope: CacheService.name });
    this.defaultTtl = options.defaultTtl || 30; // Default 30 seconds
    
    // TODO: Integrate with Redis when available
    // For now, using in-memory cache
    this.logger.info('[CacheService] Initialized with in-memory cache');
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.value as T;
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const expiresAt = Date.now() + (ttl || this.defaultTtl) * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Delete multiple keys (supports pattern matching)
   */
  async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const cached = this.cache.get(key);
    if (!cached) {
      return false;
    }
    
    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const cached of this.cache.values()) {
      if (now > cached.expiresAt) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
    };
  }
}

