import type { Client, Config, InArgs, ResultSet } from '@libsql/client';
import config from './config.ts';
import logger from './logger.ts';

/**
 * Allowed SQL value types for query arguments.
 */
type SqlValue =
  | string
  | number
  | bigint
  | boolean
  | Uint8Array
  | ArrayBuffer
  | null;
type QueryRow = Record<string, unknown>;
type QueryResult<T extends QueryRow = QueryRow> = {
  rows: T[];
  rowsAffected: number;
};

/**
 * Simple Database interface used by the rest of the app.
 */
export interface Database {
  execute<T extends QueryRow = QueryRow>(
    sql: string,
    args?: readonly SqlValue[],
  ): Promise<QueryResult<T>>;
  transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T>;
  close(): Promise<void> | void;
}

const dbConfig: Config = {
  url: config.databaseUrl,
  authToken: config.tursoAuthToken,
};

/**
 * Cached client to avoid creating a new client per query.
 * We keep a single client instance per process.
 */
let cachedClient: Client | null = null;

/**
 * Create or return the cached client instance.
 */
async function getClient(): Promise<Client> {
  if (cachedClient) return cachedClient;

  let libsql = '@libsql/client';

  if (config.env === 'production') libsql = '@libsql/client/web';

  const { createClient } = await import(libsql);

  cachedClient = (createClient as (cfg: Config) => Client)(dbConfig);
  return cachedClient;
}

/**
 * Close & clear the cached client.
 */
export async function closeClient(): Promise<void> {
  if (cachedClient && typeof (cachedClient as any).close === 'function') {
    try {
      // some client implementations expose `close()`; call it when available
      await (cachedClient as any).close();
    } catch (err) {
      logger.warn({ msg: 'Error while closing DB client', error: err });
    }
  }
  cachedClient = null;
}

/**
 * Internal helper to execute a query with a given executor (client or transaction).
 * Logs errors with context (but does not print full args to avoid leaking secrets).
 */
async function runQuery<T extends QueryRow>(
  executor: {
    execute(sql: string | { sql: string; args: InArgs }): Promise<ResultSet>;
  },
  sql: string,
  args?: readonly SqlValue[],
): Promise<QueryResult<T>> {
  try {
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
  } catch (error) {
    // Log query context but avoid logging raw argument values that may contain secrets
    logger.error(
      {
        msg: 'Database query failed',
        sql,
        argsLength: args?.length ?? 0,
        error,
      },
      'db.runQuery.error',
    );
    throw error;
  }
}

/**
 * Execute a SQL query against a pooled client (cached).
 */
export async function execute<T extends QueryRow = QueryRow>(
  sql: string,
  args?: readonly SqlValue[],
): Promise<QueryResult<T>> {
  const client = await getClient();
  return runQuery<T>(client, sql, args);
}

/**
 * Run a function inside a database transaction.
 * Commits on success, rolls back on error. Attempts to log rollback failures.
 */
export async function transaction<T>(
  fn: (tx: Database) => Promise<T>,
): Promise<T> {
  const client = await getClient();
  const tx = await (client as any).transaction(); // keep as any if typing varies by client build

  const txDatabase: Database = {
    execute: async <R extends QueryRow = QueryRow>(
      sql: string,
      args?: readonly SqlValue[],
    ) => runQuery<R>(tx, sql, args),
    transaction: () => {
      throw new Error('Nested transactions are not supported');
    },
    close: () => {
      // Transactions should be closed by commit/rollback; do nothing here
      // or throw to surface misuse:
      // throw new Error('Cannot close transaction connection directly');
    },
  };

  try {
    const result = await fn(txDatabase);
    await tx.commit();
    return result;
  } catch (error) {
    logger.error(
      { msg: 'Transaction failed, attempting rollback', error },
      'db.transaction.error',
    );
    try {
      await tx.rollback();
    } catch (rbErr) {
      logger.error(
        { msg: 'Rollback failed', error: rbErr },
        'db.transaction.rollback_error',
      );
    }
    throw error;
  }
}

/**
 * db object implementing Database for compatibility with existing code.
 */
export const db: Database = {
  execute: async <T extends QueryRow = QueryRow>(
    sql: string,
    args?: readonly SqlValue[],
  ) => execute<T>(sql, args),
  transaction: async <T>(fn: (tx: Database) => Promise<T>) =>
    transaction<T>(fn),
  close: async () => await closeClient(),
};
