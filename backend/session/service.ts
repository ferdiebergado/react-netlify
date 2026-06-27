import { randomBytes } from 'crypto';
import * as z from 'zod';

import { SESSION } from '../../shared/constants.ts';
import { BaseSchema, EntityIDSchema, type EntityID } from '../../shared/schemas/base.ts';
import type { User } from '../../shared/schemas/user.ts';
import { bakeCookie, type Cookie } from '../cookie.ts';
import { db, type Database } from '../db.ts';
import { UnauthorizedError } from '../errors.ts';
import { createSession, findSession, touchSession } from './repo.ts';

export const SessionRowSchema = z.strictObject({
  ...BaseSchema.pick({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  }).shape,
  sessionId: z.string(),
  userId: EntityIDSchema,
  expiresAt: z.iso.datetime(),
  lastActiveAt: z.iso.datetime(),
  revokedAt: z.iso.datetime().nullish(),
});

export type Session = z.infer<typeof SessionRowSchema>;

export type NewSession = Pick<Session, 'sessionId' | 'userId' | 'expiresAt'>;

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

export function bakeSessionCookie(session: NewSession): Cookie {
  const sessionCookie = bakeCookie(
    SESSION.COOKIE_NAME,
    session.sessionId,
    new Date(session.expiresAt)
  );
  sessionCookie.httpOnly = true;
  return sessionCookie;
}
