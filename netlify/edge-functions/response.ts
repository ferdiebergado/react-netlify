import type { Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
  const start = performance.now();
  const res = await context.next();

  console.log('Request completed.', {
    method: request.method,
    path: request.url,
    status: res.status,
    duration: Math.round(performance.now() - start),
  });

  return res;
};
