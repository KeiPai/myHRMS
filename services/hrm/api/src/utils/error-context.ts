/**
 * Error Context Utilities
 * Enriches errors with request metadata and context
 */

import { Context } from 'hono';
import { AppError } from '../errors/app.errors';

export interface ErrorContext {
  correlationId?: string;
  method?: string;
  path?: string;
  query?: Record<string, string>;
  ip?: string;
  userAgent?: string;
  userId?: string;
  timestamp: string;
  stack?: string;
}

/**
 * Enrich error with request context
 */
export function enrichErrorWithContext(error: Error, c: Context): ErrorContext {
  const correlationId = c.get('correlationId') as string | undefined;
  const user = c.get('auth.current.user') as any;
  const userId = user?.userId || user?.id || user?.sub as string | undefined;

  const context: ErrorContext = {
    correlationId,
    method: c.req.method,
    path: c.req.path,
    query: c.req.query(),
    ip: c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
    userAgent: c.req.header('user-agent'),
    userId,
    timestamp: new Date().toISOString(),
    stack: error.stack,
  };

  // Add context to error if it's an AppError
  if (error instanceof AppError && error.details) {
    (error.details as any).context = context;
  }

  return context;
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: Error, context?: ErrorContext): Record<string, any> {
  const baseLog: Record<string, any> = {
    error: {
      name: error.name,
      message: error.message,
      ...(error.stack && { stack: error.stack }),
    },
  };

  if (context) {
    baseLog.context = context;
  }

  // Add additional details if it's an AppError
  if (error instanceof AppError) {
    baseLog.error.code = error.code;
    baseLog.error.statusCode = error.statusCode;
    if (error.details) {
      baseLog.error.details = error.details;
    }
  }

  return baseLog;
}

