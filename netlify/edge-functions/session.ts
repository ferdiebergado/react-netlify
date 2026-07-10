import type { Context } from '@netlify/edge-functions';
import { API_BASE_URL, SESSION } from '../../shared/constants.ts';
import { ERROR_CODES, type ApiResponse } from '../../shared/types.ts';
import { createRequestMetadata } from './_shared/utils.ts';

export default async (
  request: Request,
  context: Context,
): Promise<Response> => {
  const sessionId = context.cookies.get(SESSION.COOKIE_NAME);

  if (sessionId) {
    request.headers.set(SESSION.HEADER_NAME, sessionId);
    return await context.next();
  }

  const msg = 'No session cookie';
  const meta = createRequestMetadata(context, request);
  console.warn(msg, meta);

  const url = new URL(request.url);
  if (isApiRequest(url.pathname)) {
    const payload: ApiResponse = {
      success: false,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: msg,
        requestId: context.requestId,
      },
    };

    return Response.json(payload, { status: 401 });
  }

  return Response.redirect('/signin');
};

const isApiRequest = (pathname: string) =>
  pathname.startsWith(API_BASE_URL + '/');
