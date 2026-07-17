import type { UnknownRecord } from 'type-fest';

import { API_BASE_URL } from '../../shared/constants';
import type { ApiResponse } from '../../shared/types';
import { ApiError } from './errors';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

function buildUrl(path: string) {
  const baseUrl = import.meta.env.VITE_APP_HOST + API_BASE_URL + '/';
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return new URL(normalizedPath, baseUrl).toString();
}

function mergeHeaders(init?: HeadersInit): Headers {
  const headers = new Headers(init);
  for (const [k, v] of Object.entries(DEFAULT_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return headers;
}

const isApiResponse = <T = unknown>(
  obj: UnknownRecord,
): obj is ApiResponse<T> =>
  Boolean(obj && typeof obj === 'object' && 'success' in obj);

/**
 * Make a request to the API and parse the standardized ApiResponse<T>.
 * Returns T | null (null used for unauthenticated or no-data responses).
 */
async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T | null> {
  const url = buildUrl(path);

  const init: RequestInit = {
    credentials: 'include',
    ...options,
    // merge headers safely and preserve any Headers/Record provided by the caller
    headers: mergeHeaders(options?.headers),
  };

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (error) {
    throw new Error('Network error', { cause: error });
  }

  // Keep existing behavior: treat 401 as "not authenticated"
  if (res.status === 401) return null;

  // 204 No Content -> nothing to parse
  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type') ?? '';
  let parsed: UnknownRecord;
  if (contentType.includes('application/json')) {
    try {
      parsed = await res.json();
    } catch (err) {
      throw new Error('Failed to parse JSON response', { cause: err });
    }
  } else {
    // Non-JSON responses can happen (errors, text responses). Read as text for diagnostics.
    const text = await res.text();
    // If the request was not ok, throw a helpful error including status and text.
    if (!res.ok) {
      throw new Error(`Unexpected non-JSON response (${res.status}): ${text}`);
    }
    // If OK but not JSON, return null (no data)
    return null;
  }

  // If the service uses the ApiResponse<T> envelope, handle it. Otherwise, if status not ok throw.
  if (isApiResponse<T>(parsed)) {
    const body = parsed as ApiResponse<T>;
    if (!body.success) {
      // Throw ApiError with the parsed body for richer diagnostics
      throw new ApiError(body, res.status);
    }
    // If data is undefined, return null to match previous behavior
    return (body.data ?? null) as T | null;
  }

  // If we get here, JSON parsed but didn't match ApiResponse shape
  if (!res.ok) {
    // Provide the parsed body in the thrown error for easier debugging
    throw new Error(
      `Request failed (${res.status}): ${JSON.stringify(parsed)}`,
    );
  }

  // Best-effort: return parsed as T (non-envelope API)
  return (parsed as T) ?? null;
}

export const api = {
  get: <T>(path: string, options?: RequestInit): Promise<T | null> =>
    request<T>(path, options),
  post: <T>(
    path: string,
    data?: UnknownRecord,
    options?: RequestInit,
  ): Promise<T | null> =>
    request<T>(path, {
      ...options,
      method: 'POST',
      headers: mergeHeaders(options?.headers),
      body: JSON.stringify(data ?? {}),
    }),
  put: <T>(
    path: string,
    data: UnknownRecord,
    options?: RequestInit,
  ): Promise<T | null> =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      headers: mergeHeaders(options?.headers),
      body: JSON.stringify(data),
    }),
  delete: <T>(path: string, options?: RequestInit): Promise<T | null> =>
    request<T>(path, {
      ...options,
      method: 'DELETE',
      headers: mergeHeaders(options?.headers),
    }),
};
