import type { Context } from '@netlify/edge-functions';

const GOOGLE_ACCOUNTS_URL = 'https://accounts.google.com';

function contentTypeMatches(
  contentType: string,
  contentTypeHeader: string | null | undefined,
): boolean {
  if (!contentTypeHeader) return false;

  const mediaType = contentTypeHeader.split(';')[0].trim().toLowerCase();

  return mediaType === contentType;
}

export default async (
  _request: Request,
  context: Context,
): Promise<Response> => {
  const res = await context.next();

  const contentType = res.headers.get('content-type');
  if (!contentTypeMatches('text/html', contentType)) return res;

  const baseCsp = `default-src 'self'; img-src 'self' https://*.googleusercontent.com data:; connect-src 'self' ${GOOGLE_ACCOUNTS_URL}; worker-src 'self' 'blob:'; frame-src ${GOOGLE_ACCOUNTS_URL}; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors ${GOOGLE_ACCOUNTS_URL}; upgrade-insecure-requests`;

  let csp = `${baseCsp}; script-src 'self' ${GOOGLE_ACCOUNTS_URL} 'unsafe-inline'; style-src 'self' ${GOOGLE_ACCOUNTS_URL} 'unsafe-inline'`;

  if (context.deploy.context === 'production')
    csp = `${baseCsp}; script-src 'self' ${GOOGLE_ACCOUNTS_URL}; style-src 'self' ${GOOGLE_ACCOUNTS_URL}`;

  res.headers.set('Content-Security-Policy', csp);

  return res;
};
