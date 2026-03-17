/**
 * Validation Utilities
 * Helper functions for request validation and input sanitization
 */

import { Context } from 'hono';
import { z } from 'zod';
import { ValidationError } from '../errors/app.errors';

/**
 * Sanitize string input
 * - Trim whitespace
 * - Remove null bytes
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return '';
  return input.trim().replace(/\0/g, '');
}

/**
 * Sanitize string or null
 */
export function sanitizeStringOrNull(input: string | null | undefined): string | null {
  if (!input) return null;
  const sanitized = sanitizeString(input);
  return sanitized === '' ? null : sanitized;
}

/**
 * Validate and parse request body
 */
export async function validateBody<T>(c: Context, schema: z.ZodSchema<T>): Promise<T> {
  try {
    const body = await c.req.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map(err => {
          const path = err.path.join('.');
          return `${path ? `${path}: ` : ''}${err.message}`;
        })
        .join(', ');
      throw new ValidationError(`Validation failed: ${errorMessages}`, error.issues);
    }
    throw new ValidationError('Invalid request body');
  }
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(c: Context, schema: z.ZodSchema<T>): T {
  try {
    const query = Object.fromEntries(
      Object.entries(c.req.query()).map(([key, value]) => [key, value || '']),
    );
    return schema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map(err => {
          const path = err.path.join('.');
          return `${path ? `${path}: ` : ''}${err.message}`;
        })
        .join(', ');
      throw new ValidationError(`Query validation failed: ${errorMessages}`, error.issues);
    }
    throw new ValidationError('Invalid query parameters');
  }
}

/**
 * Validate path parameters
 */
export function validateParams<T>(c: Context, schema: z.ZodSchema<T>): T {
  try {
    const params = c.req.param();
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map(err => {
          const path = err.path.join('.');
          return `${path ? `${path}: ` : ''}${err.message}`;
        })
        .join(', ');
      throw new ValidationError(`Path parameter validation failed: ${errorMessages}`, error.issues);
    }
    throw new ValidationError('Invalid path parameters');
  }
}

/**
 * Validation helpers for common data types
 * These replace deprecated Zod methods like z.string().uuid() and z.string().datetime()
 */

/**
 * Validate UUID format (replaces deprecated z.string().uuid())
 * @param val - String to validate
 * @returns true if valid UUID format
 */
export function isValidUuid(val: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(val);
}

/**
 * Validate ISO 8601 datetime format (replaces deprecated z.string().datetime())
 * @param val - String to validate
 * @returns true if valid ISO 8601 datetime format
 */
export function isValidDatetime(val: string): boolean {
  // Check if it's a valid ISO 8601 datetime string
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?$/;
  return isoRegex.test(val) && !isNaN(Date.parse(val));
}

/**
 * Zod schema for UUID validation (replaces deprecated z.string().uuid())
 */
export const zUuid = () =>
  z.string().refine(isValidUuid, { message: 'Invalid UUID format' });

/**
 * Zod schema for ISO 8601 datetime validation (replaces deprecated z.string().datetime())
 */
export const zDatetime = () =>
  z.string().refine(isValidDatetime, { message: 'Invalid ISO 8601 datetime format' });

/**
 * Zod schema for nullable ISO 8601 datetime validation
 */
export const zDatetimeNullable = () =>
  z.string().nullable().refine((val) => val === null || isValidDatetime(val), {
    message: 'Invalid ISO 8601 datetime format',
  });

/**
 * Validate email format (replaces deprecated z.string().email())
 * @param val - String to validate
 * @returns true if valid email format
 */
export function isValidEmail(val: string): boolean {
  // RFC 5322 compliant email regex (simplified version)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(val);
}

/**
 * Validate URL format (replaces deprecated z.string().url())
 * @param val - String to validate
 * @returns true if valid URL format
 */
export function isValidUrl(val: string): boolean {
  try {
    const url = new URL(val);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Zod schema for email validation (replaces deprecated z.string().email())
 */
export const zEmail = (message?: string) =>
  z.string().refine(isValidEmail, { message: message || 'Invalid email format' });

/**
 * Zod schema for URL validation (replaces deprecated z.string().url())
 */
export const zUrl = (message?: string) =>
  z.string().refine(isValidUrl, { message: message || 'Invalid URL format' });

/**
 * Zod schema for nullable URL validation
 */
export const zUrlNullable = (message?: string) =>
  z
    .string()
    .nullable()
    .refine((val) => val === null || isValidUrl(val), {
      message: message || 'Invalid URL format',
    });
