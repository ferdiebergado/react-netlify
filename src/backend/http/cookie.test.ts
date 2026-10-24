import { describe, expect, it } from 'vitest';
import { getCookieValue } from './cookie.ts';

describe('getCookieValue', () => {
  it('returns the requested cookie value', () => {
    expect(
      getCookieValue(
        'other=value; __Host-session=abc123; theme=dark',
        '__Host-session',
      ),
    ).toBe('abc123');
  });

  it('preserves equals signs and does not normalize cookie values', () => {
    expect(getCookieValue('__Host-session=abc=', '__Host-session')).toBe(
      'abc=',
    );
    expect(getCookieValue('__Host-session= abc ', '__Host-session')).toBe(
      ' abc ',
    );
  });

  it('returns undefined when the cookie is missing', () => {
    expect(getCookieValue('other=value', '__Host-session')).toBeUndefined();
    expect(getCookieValue(null, '__Host-session')).toBeUndefined();
  });

  it('rejects duplicate cookie names', () => {
    expect(
      getCookieValue(
        '__Host-session=first; __Host-session=second',
        '__Host-session',
      ),
    ).toBeUndefined();
  });
});
