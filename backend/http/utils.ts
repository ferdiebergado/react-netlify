import type { Context } from '@netlify/functions';
import type { HttpMethod, RequestContext } from './types.ts';

export const getBaseRequestContext = (req: Request, ctx: Context): RequestContext => ({
  timestamp: new Date().toISOString(),
  requestId: ctx.requestId,
  method: req.method as HttpMethod,
  path: req.url,
});

export const getRequestContext = (req: Request, ctx: Context): RequestContext => ({
  ...getBaseRequestContext(req, ctx),
  ip: ctx.ip,
  city: ctx.geo.city ?? 'unknown',
  country: ctx.geo.country?.code ?? 'unknown',
  userAgent: req.headers.get('user-agent') ?? 'unknown',
});
