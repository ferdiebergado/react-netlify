import { ERROR_CODES, type ApiResponse } from '../../shared/types.ts';
import { handleError } from '../error-handler.ts';
import logger from '../logger.ts';
import { getSession } from '../session/service.ts';
import type { HttpMethod, NetlifyHandler } from './types.ts';
import { getBaseRequestContext, getRequestContext } from './utils.ts';

type Middleware<T extends unknown[] = unknown[]> = (
  handler: NetlifyHandler,
  ...args: T
) => NetlifyHandler;

export const withMiddlewares: Middleware = (handler: NetlifyHandler) =>
  withErrorHandler(logRequest(attachSession(handler)));

export const withErrorHandler: Middleware = (handler: NetlifyHandler) => {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      const requestContext = getRequestContext(request, context);
      return handleError(error, requestContext);
    }
  };
};

export const logRequest: Middleware = (handler: NetlifyHandler) => {
  return async (request, context) => {
    const start = performance.now();
    const response = await handler(request, context);
    const durationMs = Math.round(performance.now() - start);

    logger.info({
      msg: 'Request completed.',
      ...getBaseRequestContext(request, context),
      statusCode: response.status,
      durationMs,
    });

    return response;
  };
};

export const attachSession: Middleware = (handler: NetlifyHandler) => {
  return async (request, context) => {
    const session = await getSession(request);
    request.session = session;
    return await handler(request, context);
  };
};

export const checkMethod: Middleware<[HttpMethod[]]> =
  (handler: NetlifyHandler, allowedMethods: HttpMethod[]) =>
  async (request, context) => {
    if (!allowedMethods.includes(request.method as HttpMethod)) {
      const payload: ApiResponse = {
        success: false,
        error: {
          code: ERROR_CODES.METHOD_NOT_ALLOWED,
          message: 'Method not allowed',
          requestId: context.requestId,
        },
      };

      return Response.json(payload, {
        status: 405,
        headers: { Allow: allowedMethods.join(',') },
      });
    }

    return await handler(request, context);
  };
