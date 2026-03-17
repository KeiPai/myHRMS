/**
 * PostgreSQL DataSource
 * Manages database connections using node-postgres driver
 * Following Ignis BaseDataSource pattern
 */

import { BaseDataSource, datasource, TAnyDataSourceSchema } from '@venizia/ignis';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getDatabaseUrl } from '../config/env.config';
// TODO: Import your schema tables here
// import { yourTable } from '../models/your.schema';

interface IDbConfig {
  connectionString: string;
}

// Export schema for Drizzle
// TODO: Replace with your actual schema
export const schema = {
  // Add your tables here
  // yourTable: yourTable,
};

@datasource({ driver: 'node-postgres' })
export class DbDataSource extends BaseDataSource<IDbConfig, TAnyDataSourceSchema> {
  constructor() {
    super({
      name: DbDataSource.name,
      config: {
        connectionString: getDatabaseUrl(),
      },
    });
  }

  /**
   * Configure the database connection pool
   */
  override async configure(): Promise<void> {
    const connectionString = await this.getConnectionString();

    this.pool = new Pool({
      connectionString,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
    });

    // Initialize the Drizzle connector
    // Use schema from BaseDataSource if available, otherwise use local schema
    const drizzleSchema = (this as any).schema || schema;
    this.connector = drizzle({ client: this.pool, schema: drizzleSchema }) as any;

    this.logger.info('Database connection pool initialized');
  }

  /**
   * Get the database connection string
   */
  override async getConnectionString(): Promise<string> {
    if (!this.settings.connectionString) {
      throw new Error(
        '[HrmDataSource] DATABASE_URL or APP_ENV_DATABASE_URL environment variable is required.\n' +
        'Please set DATABASE_URL in your environment or .env file.\n' +
        `Example: DATABASE_URL=postgresql://user:password@localhost:5432/hrm_db\n` +
        `Or set APP_ENV_DATABASE_URL in your .env file.`,
      );
    }
    return this.settings.connectionString;
  }

  /**
   * Graceful shutdown - close the connection pool
   */
  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.logger.info('Database connection pool closed');
    }
  }
}
