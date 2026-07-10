import type { Context } from '@netlify/functions';
import { OAUTH_STATE_COOKIE } from '../../backend/auth/google.ts';
import { signin } from '../../backend/auth/service.ts';
import config from '../../backend/config.ts';
import {
  checkMethod,
  logRequest,
  withErrorHandler,
} from '../../backend/http/middlewares.ts';
import { getBaseRequestContext } from '../../backend/http/utils.ts';
import logger from '../../backend/logger.ts';
import { bakeSessionCookie } from '../../backend/session/service.ts';

async function handler(request: Request, context: Context): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const authCode = searchParams.get('code');
  const state = searchParams.get('state');

  const savedState = context.cookies.get(OAUTH_STATE_COOKIE);

  context.cookies.delete(OAUTH_STATE_COOKIE);

  if (!authCode || !state || state !== savedState) {
    const signinUrl = new URL(`${config.host}/signin`);
    signinUrl.searchParams.set('error', 'Access denied.');
    logger.warn({
      ...getBaseRequestContext(request, context),
      msg: 'Signin failed.',
    });

    return Response.redirect(signinUrl);
  }

  const { user, sessionId, expiresAt } = await signin(authCode);

  const sessionCookie = bakeSessionCookie(sessionId, expiresAt);
  context.cookies.set(sessionCookie);

  logger.info({
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    msg: 'User signed in.',
    event: 'auth.signin.success',
    userId: user.googleId,
  });

  const dashboardUrl = new URL(config.host);
  dashboardUrl.searchParams.set('success', 'Signed in succesfully.');

  return Response.redirect(dashboardUrl);
}

export default withErrorHandler(logRequest(checkMethod(handler, ['GET'])));
