import type { Config, Context } from '@netlify/edge-functions';
import { ERROR_CODES, type ApiResponse } from '../../shared/types.ts';
import { createRequestMetadata } from './_shared/utils.ts';

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
    const meta = createRequestMetadata(context, request);

    const payload: ApiResponse = {
      success: false,
      error: {
        code: ERROR_CODES.FORBIDDEN,
        message: 'cross-origin requests disallowed',
        requestId: context.requestId,
      },
    };

    console.warn(payload.error.message, meta);

    return Response.json(payload, { status });
  }

  return await context.next();
};
