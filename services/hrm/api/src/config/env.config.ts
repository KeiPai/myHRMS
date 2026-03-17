/**
 * Environment Configuration
 * Centralized environment variable management with validation
 */

import { z } from 'zod';

/**
 * Environment variable schema
 * All environment variables must use APP_ENV_ prefix
 */
const envSchema = z.object({
  // Server Configuration
  APP_ENV_HOST: z.string().default('0.0.0.0'),
  APP_ENV_PORT: z.string().transform(Number).pipe(z.number().int().positive()).default(3001),
  
  // Database Configuration
  APP_ENV_DATABASE_URL: z.string().url().optional(),
  
  // JWT Configuration
  APP_ENV_JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters').default('your-super-secret-jwt-key-change-this-in-production-min-32-chars'),
  APP_ENV_JWT_ISSUER: z.string().optional(),
  APP_ENV_JWT_AUDIENCE: z.string().optional(),
  
  // Keycloak Configuration (for OAuth login)
  APP_ENV_KEYCLOAK_URL: z.string().url().default('http://localhost:18080'),
  APP_ENV_KEYCLOAK_REALM: z.string().default('veni-ai'),
  APP_ENV_KEYCLOAK_CLIENT_ID: z.string().default('veni-ai-platform'),
  APP_ENV_KEYCLOAK_CLIENT_SECRET: z.string().optional(),
  
  // MinIO Configuration (Object Storage)
  APP_ENV_MINIO_ENDPOINT: z.string().default('localhost'),
  APP_ENV_MINIO_PORT: z.string().transform(Number).pipe(z.number().int().positive()).default(19000),
  APP_ENV_MINIO_USE_SSL: z.string().transform(val => val === 'true').default(false),
  APP_ENV_MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  APP_ENV_MINIO_SECRET_KEY: z.string().default('minioadmin'),
  APP_ENV_MINIO_BUCKET_PREFIX: z.string().optional(),
  
  // Redis Configuration (Cache & Session Store)
  APP_ENV_REDIS_URL: z.string().url().optional(),
  
  // Application URLs
  APP_ENV_API_URL: z.string().url().default('http://localhost:3001'),
  APP_ENV_FRONTEND_URL: z.string().url().default('http://localhost:4173'),

  // Shell API (for token exchange: Remote API → Shell API gRPC)
  APP_ENV_SHELL_GRPC_URL: z.string().url().default('http://localhost:3000/api'),

  // CORS Configuration
  APP_ENV_CORS_ORIGINS: z.string().optional(), // Comma-separated list of allowed origins
  APP_ENV_NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
  APP_ENV_SERVER_BASE_PATH: z.string().default('/api'),
});

type EnvInput = z.input<typeof envSchema>;
type EnvOutput = z.output<typeof envSchema>;

/**
 * Parse and validate environment variables
 * All environment variables must use APP_ENV_ prefix
 */
function parseEnv(): EnvOutput {
  const rawEnv: EnvInput = {
    APP_ENV_HOST: process.env.APP_ENV_HOST,
    APP_ENV_PORT: process.env.APP_ENV_PORT || process.env.PORT,
    APP_ENV_DATABASE_URL: process.env.APP_ENV_DATABASE_URL || process.env.DATABASE_URL,
    APP_ENV_JWT_SECRET: process.env.APP_ENV_JWT_SECRET || process.env.JWT_SECRET,
    APP_ENV_JWT_ISSUER: process.env.APP_ENV_JWT_ISSUER,
    APP_ENV_JWT_AUDIENCE: process.env.APP_ENV_JWT_AUDIENCE,
    APP_ENV_KEYCLOAK_URL: process.env.APP_ENV_KEYCLOAK_URL || process.env.KEYCLOAK_URL,
    APP_ENV_KEYCLOAK_REALM: process.env.APP_ENV_KEYCLOAK_REALM || process.env.KEYCLOAK_REALM,
    APP_ENV_KEYCLOAK_CLIENT_ID: process.env.APP_ENV_KEYCLOAK_CLIENT_ID || process.env.KEYCLOAK_CLIENT_ID,
    APP_ENV_KEYCLOAK_CLIENT_SECRET: process.env.APP_ENV_KEYCLOAK_CLIENT_SECRET || process.env.KEYCLOAK_CLIENT_SECRET,
    APP_ENV_MINIO_ENDPOINT: process.env.APP_ENV_MINIO_ENDPOINT,
    APP_ENV_MINIO_PORT: process.env.APP_ENV_MINIO_PORT,
    APP_ENV_MINIO_USE_SSL: process.env.APP_ENV_MINIO_USE_SSL,
    APP_ENV_MINIO_ACCESS_KEY: process.env.APP_ENV_MINIO_ACCESS_KEY,
    APP_ENV_MINIO_SECRET_KEY: process.env.APP_ENV_MINIO_SECRET_KEY,
    APP_ENV_MINIO_BUCKET_PREFIX: process.env.APP_ENV_MINIO_BUCKET_PREFIX,
    APP_ENV_REDIS_URL: process.env.APP_ENV_REDIS_URL || process.env.REDIS_URL,
    APP_ENV_API_URL: process.env.APP_ENV_API_URL,
    APP_ENV_FRONTEND_URL: process.env.APP_ENV_FRONTEND_URL,
    APP_ENV_SHELL_GRPC_URL: process.env.APP_ENV_SHELL_GRPC_URL,
    APP_ENV_CORS_ORIGINS: process.env.APP_ENV_CORS_ORIGINS || process.env.CORS_ORIGINS,
    APP_ENV_NODE_ENV: (process.env.APP_ENV_NODE_ENV || process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    APP_ENV_SERVER_BASE_PATH: process.env.APP_ENV_SERVER_BASE_PATH || '/api',
  };

  try {
    return envSchema.parse(rawEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('\n');
      throw new Error(`Environment validation failed:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Validated environment configuration
 */
export const env = parseEnv();

/**
 * Get database connection URL
 */
export function getDatabaseUrl(): string {
  if (!env.APP_ENV_DATABASE_URL) {
    throw new Error(
      'APP_ENV_DATABASE_URL or DATABASE_URL environment variable is required.\n' +
      'Please set APP_ENV_DATABASE_URL in your environment or .env file.\n' +
      `Example: APP_ENV_DATABASE_URL=postgresql://user:password@localhost:5432/hrm_db`
    );
  }
  return env.APP_ENV_DATABASE_URL;
}

/**
 * Get JWT configuration
 */
export function getJwtConfig() {
  return {
    secret: env.APP_ENV_JWT_SECRET,
    issuer: env.APP_ENV_JWT_ISSUER,
    audience: env.APP_ENV_JWT_AUDIENCE,
  };
}

/**
 * Get Keycloak configuration
 */
export function getKeycloakConfig() {
  return {
    url: env.APP_ENV_KEYCLOAK_URL,
    realm: env.APP_ENV_KEYCLOAK_REALM,
    clientId: env.APP_ENV_KEYCLOAK_CLIENT_ID,
    clientSecret: env.APP_ENV_KEYCLOAK_CLIENT_SECRET,
  };
}

/**
 * Get application URLs
 */
export function getAppUrls() {
  return {
    api: env.APP_ENV_API_URL,
    frontend: env.APP_ENV_FRONTEND_URL,
  };
}

/**
 * Get Shell API gRPC base URL (for AuthGateway.ExchangeForService)
 */
export function getShellGrpcUrl(): string {
  return env.APP_ENV_SHELL_GRPC_URL.replace(/\/$/, '');
}

/**
 * Get CORS allowed origins
 * Parses APP_ENV_CORS_ORIGINS environment variable or uses default frontend URL
 */
export function getCorsOrigins(): string[] {
  let origins: string[] = [];
  
  if (env.APP_ENV_CORS_ORIGINS) {
    origins = env.APP_ENV_CORS_ORIGINS.split(',').map(origin => origin.trim());
  } else {
    // Default origins
    origins = [
      env.APP_ENV_FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:4173',
    ];
  }
  
  // Remove duplicates and empty strings
  return Array.from(new Set(origins.filter(origin => origin && origin.length > 0)));
}
