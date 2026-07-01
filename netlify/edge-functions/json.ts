import type { Config, Context } from '@netlify/edge-functions';
import { ERROR_CODES, type ApiResponse } from '../../shared/types.ts';

export const config: Config = {
  method: ['POST', 'PUT', 'PATCH'],
};

export default async (
  request: Request,
  context: Context,
): Promise<Response> => {
  const contentType = request.headers.get('content-type');

  if (!contentType || !/^application\/json(;.*)?$/i.test(contentType)) {
    const payload: ApiResponse = {
      success: false,
      error: {
        code: ERROR_CODES.UNSUPPORTED_MEDIA,
        message: 'Unsupported data type',
      },
    };

    const status = 415;
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

    console.warn(payload.error, { meta });

    return Response.json(payload, { status });
  }

  return await context.next();
};
