export const SESSION = {
  COOKIE_NAME: '__Host-session',
  ID_LENGTH: 32,
  DURATION_MINUTES: 60 * 24 * 30 * 3, // 90 days
} as const;

export const API_BASE_URL = '/api';
