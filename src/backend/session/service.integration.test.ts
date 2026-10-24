import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SESSION } from '../../shared/constants.ts';
import { createTestDB } from '../../../tests/db.ts';
import type { Database } from '../db.ts';
import { UnauthorizedError } from '../errors.ts';
import { revokeSession } from './repo.ts';
import { getSession, startSession } from './service.ts';

describe('session validation', () => {
  let db: Database;
  let userId: number;

  beforeEach(async () => {
    db = await createTestDB();
    const { rows } = await db.execute<{ id: number }>(
      `INSERT INTO users (google_id, name, email)
       VALUES (?, ?, ?)
       RETURNING id`,
      ['integration-test-user', 'Integration Test', 'session-test@example.com'],
    );
    userId = rows[0].id;
  });

  afterEach(async () => {
    await db.close();
  });

  it('accepts a valid session cookie and returns its session', async () => {
    const session = await startSession(db, userId);
    const request = new Request('https://example.com/api/me', {
      headers: {
        cookie: `${SESSION.COOKIE_NAME}=${session.sessionId}`,
      },
    });

    await expect(getSession(request, db)).resolves.toMatchObject({
      sessionId: session.sessionId,
      userId,
    });
  });

  it('rejects a missing session cookie', async () => {
    const request = new Request('https://example.com/api/me');

    await expect(getSession(request, db)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it('rejects an unknown session ID', async () => {
    const request = new Request('https://example.com/api/me', {
      headers: {
        cookie: `${SESSION.COOKIE_NAME}=unknown-session`,
      },
    });

    await expect(getSession(request, db)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it('rejects an expired session', async () => {
    const session = await startSession(db, userId);
    await db.execute(
      'UPDATE sessions SET expires_at = ? WHERE session_id = ?',
      [new Date(Date.now() - 60_000).toISOString(), session.sessionId],
    );
    const request = new Request('https://example.com/api/me', {
      headers: {
        cookie: `${SESSION.COOKIE_NAME}=${session.sessionId}`,
      },
    });

    await expect(getSession(request, db)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it('rejects a revoked session', async () => {
    const session = await startSession(db, userId);
    await revokeSession(db, session.sessionId, userId);
    const request = new Request('https://example.com/api/me', {
      headers: {
        cookie: `${SESSION.COOKIE_NAME}=${session.sessionId}`,
      },
    });

    await expect(getSession(request, db)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });
});
