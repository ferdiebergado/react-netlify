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

  const includeUnsafeInline = () =>
    context.deploy.context === 'dev' ? `'unsafe-inline'` : '';

  const csp = `default-src 'self'; script-src 'self' ${GOOGLE_ACCOUNTS_URL} ${includeUnsafeInline()}; style-src 'self' ${GOOGLE_ACCOUNTS_URL} ${includeUnsafeInline()}; img-src 'self' https://*.googleusercontent.com data:; connect-src 'self' ${GOOGLE_ACCOUNTS_URL}; worker-src 'self'; frame-src ${GOOGLE_ACCOUNTS_URL}; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors ${GOOGLE_ACCOUNTS_URL}; upgrade-insecure-requests`;

  res.headers.set('Content-Security-Policy', csp);

  return res;
};
