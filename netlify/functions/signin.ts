import type { Context } from '@netlify/functions';
import { randomBytes } from 'crypto';
import { generateAuthUrl, OAUTH_STATE_COOKIE } from '../../backend/auth/google.ts';
import type { Cookie } from '../../backend/http/cookie.ts';
import { logRequest, withErrorHandler } from '../../backend/http/middlewares.ts';
import type { AppRequest, HttpMethod } from '../../backend/http/types.ts';

async function handler(request: AppRequest, context: Context) {
  const allowedMethod: HttpMethod = 'GET';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const state = randomBytes(32).toString('base64url');

  const authUrl = generateAuthUrl(state);

  const stateCookie: Cookie = {
    name: OAUTH_STATE_COOKIE,
    value: state,
    path: '/',
    maxAge: 300,
    secure: true,
    httpOnly: true,
    sameSite: 'Lax',
  };

  context.cookies.set(stateCookie);

  return Response.redirect(authUrl, 302);
}

export default withErrorHandler(logRequest(handler));
