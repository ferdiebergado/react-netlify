import type { Context } from '@netlify/edge-functions';
import { API_BASE_URL, SESSION } from '../../shared/constants.ts';
import { ERROR_CODES, type ApiResponse } from '../../shared/types.ts';

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
  console.warn(msg, {
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    method: request.method,
    path: request.url,
    ip: context.ip,
    city: context.geo.city ?? 'unknown',
    country: context.geo.country?.code ?? 'unknown',
    userAgent: request.headers.get('user-agent') ?? 'unknown',
  });

  const url = new URL(request.url);
  if (url.pathname.startsWith(API_BASE_URL + '/')) {
    const payload: ApiResponse = {
      success: false,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: msg },
    };

    return Response.json(payload, { status: 401 });
  }

  return Response.redirect('/signin');
};
