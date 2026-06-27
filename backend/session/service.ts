import { randomBytes } from 'crypto';
import { SESSION } from '../../shared/constants.ts';
import { type EntityID } from '../../shared/schemas/base.ts';
import type { User } from '../../shared/schemas/user.ts';
import { db, type Database } from '../db.ts';
import { UnauthorizedError } from '../errors.ts';
import { bakeCookie, type Cookie } from '../http/cookie.ts';
import { createSession, findSession, touchSession } from './repo.ts';
import type { NewSession, Session } from './types.ts';

export async function startSession(db: Database, userId: EntityID): Promise<Session> {
  const session = generateSession(userId);

  return await createSession(db, session);
}

export function generateSession(userId: User['id']): NewSession {
  const sessionId = randomBytes(SESSION.ID_LENGTH).toString('base64');
  const expiresAt = setExpiryDate();

  return {
    sessionId,
    userId,
    expiresAt,
  };
}

export async function getSession(req: Request): Promise<Session> {
  const sessionId = req.headers.get(SESSION.HEADER_NAME);
  if (!sessionId) throw new UnauthorizedError('no session ID provided');

  const session = await findSession(db, sessionId);
  if (!session) throw new UnauthorizedError('session not found');

  const lastActiveTime = new Date(session.lastActiveAt).getTime();
  const elapsedTime = Date.now() - lastActiveTime;
  const minuteMs = 1000 * 60;
  if (elapsedTime > minuteMs) await touchSession(db, sessionId);

  return session;
}

export const setExpiryDate = (minutes = SESSION.DURATION_MINUTES): string =>
  new Date(Date.now() + minutes * 60_000).toISOString();

export function bakeSessionCookie(sessionId: string, expiresAt: string): Cookie {
  const sessionCookie = bakeCookie(SESSION.COOKIE_NAME, sessionId, new Date(expiresAt));
  sessionCookie.httpOnly = true;
  return sessionCookie;
}
