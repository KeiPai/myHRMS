/**
 * Custom Application Errors
 * Standardized error classes for better error handling
 */

export enum ErrorCode {
  // Authentication Errors
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  TOKEN_ERROR = 'TOKEN_ERROR',
  
  // General Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  
  // TODO: Add service-specific error codes here
}

/**
 * Base Application Error
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: unknown) {
    super(
      ErrorCode.AUTHENTICATION_ERROR,
      message,
      401,
      details
    );
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Authorization failed', details?: unknown) {
    super(
      ErrorCode.AUTHORIZATION_ERROR,
      message,
      403,
      details
    );
  }
}

/**
 * Validation Error
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(
      ErrorCode.VALIDATION_ERROR,
      message,
      400,
      details
    );
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      ErrorCode.NOT_FOUND,
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      404,
      { resource, id }
    );
  }
}

/**
 * Standardized Error Response Format
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Convert AppError to ErrorResponse
 * Sanitizes error messages to prevent information leakage
 */
export function toErrorResponse(error: AppError | Error, sanitize: boolean = true): ErrorResponse {
  // Import env here to avoid circular dependency
  const nodeEnv = process.env.APP_ENV_NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';
  
  if (error instanceof AppError) {
    // For known errors, use the message as-is (already user-friendly)
    let message = error.message;
    
    // Sanitize internal error details in production
    if (sanitize && isProduction) {
      // Don't expose internal error details
      if (error.code === ErrorCode.INTERNAL_ERROR) {
        message = 'An internal error occurred. Please try again later.';
      }
    }
    
    const response: ErrorResponse = {
      error: {
        code: error.code,
        message,
      },
    };
    
    // Only include details in development
    if (error.details && !isProduction) {
      response.error.details = error.details;
    }
    
    return response;
  }

  // For unknown errors, sanitize message in production
  const message = sanitize && isProduction
    ? 'An internal error occurred. Please try again later.'
    : (error.message || 'Internal server error');

  return {
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message,
    },
  };
}
