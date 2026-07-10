import type { Context } from '@netlify/functions';
import { randomBytes } from 'crypto';
import {
  generateAuthUrl,
  OAUTH_STATE_COOKIE,
} from '../../backend/auth/google.ts';
import { bakeCookie } from '../../backend/http/cookie.ts';
import {
  checkMethod,
  logRequest,
  withErrorHandler,
} from '../../backend/http/middlewares.ts';
import type { AppRequest } from '../../backend/http/types.ts';

async function handler(_: AppRequest, context: Context) {
  const state = randomBytes(32).toString('base64url');
  const authUrl = generateAuthUrl(state);

  const stateCookie = bakeCookie(
    OAUTH_STATE_COOKIE,
    state,
    new Date(Date.now() + 300000),
  );
  stateCookie.httpOnly = true;
  context.cookies.set(stateCookie);

  return Response.redirect(authUrl);
}

export default withErrorHandler(logRequest(checkMethod(handler, ['GET'])));
