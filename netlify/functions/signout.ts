import type { Context } from '@netlify/functions';
import { db } from '../../backend/db.ts';
import { NotFoundError } from '../../backend/errors.ts';
import {
  checkMethod,
  withMiddlewares,
} from '../../backend/http/middlewares.ts';
import type { AppRequest } from '../../backend/http/types.ts';
import { softDeleteSession } from '../../backend/session/repo.ts';
import { SESSION } from '../../shared/constants.ts';
import type { ApiResponse } from '../../shared/types.ts';

async function handler(request: AppRequest, context: Context) {
  const isDeleted = await softDeleteSession(db, request.session.sessionId);

  if (!isDeleted)
    throw new NotFoundError('Session not found or already deleted.');

  const payload: ApiResponse = {
    success: true,
  };

  context.cookies.delete(SESSION.COOKIE_NAME);
  return Response.json(payload);
}

export default withMiddlewares(checkMethod(handler, ['POST']));
