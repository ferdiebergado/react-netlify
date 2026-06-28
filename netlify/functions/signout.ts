import type { Context } from '@netlify/functions';
import { db } from '../../backend/db.ts';
import { NotFoundError } from '../../backend/errors.ts';
import { withMiddlewares } from '../../backend/http/middlewares.ts';
import type { AppRequest, HttpMethod } from '../../backend/http/types.ts';
import { softDeleteSession } from '../../backend/session/repo.ts';
import { bakeSessionCookie } from '../../backend/session/service.ts';
import type { ApiResponse } from '../../shared/types.ts';

async function handler(request: AppRequest, ctx: Context) {
  const allowedMethod: HttpMethod = 'POST';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const isDeleted = await softDeleteSession(db, request.session.sessionId);

  if (!isDeleted) throw new NotFoundError('Session not found or already deleted.');

  const payload: ApiResponse = {
    success: true,
  };

  const sessionCookie = bakeSessionCookie('', new Date().toISOString());
  ctx.cookies.set(sessionCookie);
  return Response.json(payload);
}

export default withMiddlewares(handler);
