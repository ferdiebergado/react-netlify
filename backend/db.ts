import { type Client, type Config, type InArgs, type ResultSet } from '@libsql/client';

import config from './config.ts';
import logger from './logger.ts';

// Type definitions
type SqlValue = string | number | bigint | boolean | Uint8Array | ArrayBuffer | null;
type QueryRow = Record<string, unknown>;
type QueryResult<T extends QueryRow = QueryRow> = {
  rows: T[];
  rowsAffected: number;
};

// Database interface for backward compatibility
export interface Database {
  execute<T extends QueryRow>(sql: string, args?: readonly SqlValue[]): Promise<QueryResult<T>>;
  transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T>;
  close(): Promise<void> | void;
}

const dbConfig: Config = {
  url: config.databaseUrl,
  authToken: config.tursoAuthToken,
};

async function getClient() {
  let factory: (config: Config) => Client;

  if (config.env === 'production') {
    const { createClient } = await import('@libsql/client/web');
    factory = createClient;
  } else {
    const { createClient } = await import('@libsql/client');
    factory = createClient;
  }

  return factory(dbConfig);
}

/**
 * Internal helper to execute a query.
 */
async function runQuery<T extends QueryRow>(
  executor: { execute(sql: string | { sql: string; args: InArgs }): Promise<ResultSet> },
  sql: string,
  args?: readonly SqlValue[]
): Promise<QueryResult<T>> {
  const result = args
    ? await executor.execute({
        sql,
        args: args as InArgs,
      })
    : await executor.execute(sql);

  return {
    rows: result.rows as unknown as T[],
    rowsAffected: result.rowsAffected,
  };
}

/**
 * Executes a SQL query.
 */
export async function execute<T extends QueryRow>(
  sql: string,
  args?: readonly SqlValue[]
): Promise<QueryResult<T>> {
  const client = await getClient();
  return runQuery<T>(client, sql, args);
}

/**
 * Runs a function within a database transaction.
 * Automatically commits on success or rolls back on error.
 * Returns a Database-like object for the transaction.
 */
export async function transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T> {
  const client = await getClient();
  const tx = await client.transaction();

  // Create a Database-like object for the transaction
  const txDatabase: Database = {
    execute: async <T extends QueryRow>(
      sql: string,
      args?: readonly SqlValue[]
    ): Promise<QueryResult<T>> => runQuery<T>(tx, sql, args),
    transaction: () => {
      throw new Error('Nested transactions are not supported');
    },

    close: () => {
      throw new Error('Cannot close transaction connection');
    },
  };

  try {
    const result = await fn(txDatabase);
    await tx.commit();
    return result;
  } catch (error) {
    logger.error(error, 'Rolling back transaction due to error');
    await tx.rollback();
    throw error;
  }
}

// Create and export the db object that implements the Database interface
export const db: Database = {
  execute: async <T extends QueryRow>(
    sql: string,
    args?: readonly SqlValue[]
  ): Promise<QueryResult<T>> => execute<T>(sql, args),
  transaction: async <T>(fn: (tx: Database) => Promise<T>): Promise<T> => transaction<T>(fn),
  close: () => {},
};
