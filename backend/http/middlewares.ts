import { handleError } from '../error-handler.ts';
import logger from '../logger.ts';
import { getSession } from '../session/service.ts';
import type { NetlifyHandler } from './types.ts';
import { getBaseRequestContext, getRequestContext } from './utils.ts';

type Middleware = (handler: NetlifyHandler) => NetlifyHandler;

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
