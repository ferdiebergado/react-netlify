import type { Context } from '@netlify/functions';
import type { Session } from '../session/types.ts';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type AppRequest = Request & { session: Session };

export type NetlifyHandler = (
  request: AppRequest,
  context: Context
) => Promise<Response> | Response;

export type RequestContext = {
  timestamp: string;
  requestId: string;
  method: HttpMethod;
  path: string;
  ip?: string;
  city?: string;
  country?: string;
  userAgent?: string;
};
