import type { Context } from '@netlify/functions';
import type { Session } from '../session/types.ts';

export const VALID_METHODS_LIST = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;

export type HttpMethod = (typeof VALID_METHODS_LIST)[number];

export type AppRequest = Request & { session: Session };

export type NetlifyHandler = (
  request: AppRequest,
  context: Context,
) => Promise<Response> | Response;

export type RequestContext = {
  timestamp: string;
  requestId: string;
  method: string;
  path: string;
  ip?: string;
  city?: string;
  country?: string;
  userAgent?: string;
};
