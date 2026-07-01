import type { Config, Context } from '@netlify/edge-functions';
import { ERROR_CODES, type ApiResponse } from '../../shared/types.ts';

export const config: Config = {
  method: ['POST', 'PUT', 'PATCH', 'DELETE'],
};

export default async (
  request: Request,
  context: Context,
): Promise<Response> => {
  const fetchSite = request.headers.get('sec-fetch-site');

  if (!fetchSite || fetchSite !== 'same-origin') {
    const status = 403;
    const meta = {
      timestamp: new Date().toISOString(),
      requestId: context.requestId,
      method: request.method,
      path: request.url,
      ip: context.ip,
      city: context.geo.city ?? 'unknown',
      country: context.geo.country?.code ?? 'unknown',
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      status,
    };

    const payload: ApiResponse = {
      success: false,
      error: {
        code: ERROR_CODES.FORBIDDEN,
        message: 'cross-origin requests disallowed',
      },
    };

    console.warn(payload.error.message, { meta });

    return Response.json(payload, { status });
  }

  return await context.next();
};
