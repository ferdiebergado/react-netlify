import type { Context } from '@netlify/edge-functions';

export const createRequestMetadata = (context: Context, request: Request) => ({
  timestamp: new Date().toISOString(),
  requestId: context.requestId,
  method: request.method,
  path: request.url,
  ip: context.ip,
  city: context.geo.city ?? 'unknown',
  country: context.geo.country?.code ?? 'unknown',
  userAgent: request.headers.get('user-agent') ?? 'unknown',
});
