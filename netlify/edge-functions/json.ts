import type { Config, Context } from '@netlify/edge-functions';
import { ERROR_CODES, type ApiResponse } from '../../shared/types.ts';
import { createRequestMetadata } from './_shared/utils.ts';

export const config: Config = {
  method: ['POST', 'PUT', 'PATCH'],
};

export default async (
  request: Request,
  context: Context,
): Promise<Response> => {
  const contentType = request.headers.get('content-type');

  if (!contentType || contentType.split(';')[0] !== 'application/json') {
    const payload: ApiResponse = {
      success: false,
      error: {
        code: ERROR_CODES.UNSUPPORTED_MEDIA,
        message: 'Unsupported data type',
        requestId: context.requestId,
      },
    };

    const status = 415;
    const meta = createRequestMetadata(context, request);

    console.warn(payload.error, meta);

    return Response.json(payload, { status });
  }

  return await context.next();
};
