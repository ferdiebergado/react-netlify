import type { Context } from '@netlify/functions';
import { randomBytes } from 'crypto';
import { generateAuthUrl, OAUTH_STATE_COOKIE } from '../../backend/auth/google.ts';
import { bakeCookie } from '../../backend/http/cookie.ts';
import { logRequest, withErrorHandler } from '../../backend/http/middlewares.ts';
import type { AppRequest, HttpMethod } from '../../backend/http/types.ts';

async function handler(request: AppRequest, context: Context) {
  const allowedMethod: HttpMethod = 'GET';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const state = randomBytes(32).toString('base64url');
  const authUrl = generateAuthUrl(state);

  const stateCookie = bakeCookie(OAUTH_STATE_COOKIE, state, new Date(Date.now() + 300000));
  stateCookie.httpOnly = true;
  context.cookies.set(stateCookie);

  return Response.redirect(authUrl, 302);
}

export default withErrorHandler(logRequest(handler));
