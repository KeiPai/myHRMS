/**
 * Logger Utilities
 * Enhanced logging with structured context
 */

import { Context } from 'hono';

/**
 * Create a logger with request context
 */
export function createRequestLogger(scope: string, c?: Context) {
  const correlationId = c?.get('correlationId') as string | undefined;
  const userId = c?.get('user')?.id as string | undefined;

  // BaseHelper doesn't have log methods, use console instead
  return {
    debug: (message: string, data?: Record<string, any>) => {
      console.debug(`[${scope}] ${message}`, {
        ...data,
        ...(correlationId && { correlationId }),
        ...(userId && { userId }),
      });
    },
    info: (message: string, data?: Record<string, any>) => {
      console.info(`[${scope}] ${message}`, {
        ...data,
        ...(correlationId && { correlationId }),
        ...(userId && { userId }),
      });
    },
    warn: (message: string, data?: Record<string, any>) => {
      console.warn(`[${scope}] ${message}`, {
        ...data,
        ...(correlationId && { correlationId }),
        ...(userId && { userId }),
      });
    },
    error: (message: string, error?: Error | Record<string, any>) => {
      const errorData: Record<string, any> = {
        ...(correlationId && { correlationId }),
        ...(userId && { userId }),
      };

      if (error instanceof Error) {
        errorData.error = {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
      } else if (error) {
        Object.assign(errorData, error);
      }

      console.error(`[${scope}] ${message}`, errorData);
    },
  };
}

/**
 * Performance logger for tracking slow operations
 */
export class PerformanceLogger {
  private startTime: number;
  private operation: string;
  private context?: Record<string, any>;

  constructor(_scope: string, operation: string, context?: Record<string, any>) {
    this.startTime = Date.now();
    this.operation = operation;
    this.context = context;
  }

  /**
   * End performance tracking and log if threshold exceeded
   */
  end(thresholdMs: number = 1000): void {
    const duration = Date.now() - this.startTime;
    
    // BaseHelper doesn't have log methods, use console instead
    if (duration > thresholdMs) {
      console.warn(`[PerformanceLogger] Slow operation detected: ${this.operation}`, {
        operation: this.operation,
        duration: `${duration}ms`,
        threshold: `${thresholdMs}ms`,
        ...this.context,
      });
    } else {
      console.debug(`[PerformanceLogger] Operation completed: ${this.operation}`, {
        operation: this.operation,
        duration: `${duration}ms`,
        ...this.context,
      });
    }
  }

  /**
   * Get current duration
   */
  getDuration(): number {
    return Date.now() - this.startTime;
  }
}

