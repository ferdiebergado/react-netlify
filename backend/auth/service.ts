import { db } from '../db.ts';
import { startSession } from '../session/service.ts';
import { oauthClient, verifyAuthCode } from './google.ts';
import { upsertUser } from './repo.ts';

export async function signin(code: string) {
  const user = await verifyAuthCode(oauthClient, code);
  const userId = await upsertUser(db, user);
  const { sessionId, expiresAt } = await startSession(db, userId);

  return { user, sessionId, expiresAt };
}
