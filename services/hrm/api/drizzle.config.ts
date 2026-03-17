import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/schemas/*.schema.ts'],
  out: './database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.APP_ENV_DATABASE_URL || process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: false,
});

