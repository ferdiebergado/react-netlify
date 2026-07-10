import { OAuth2Client } from 'google-auth-library';

import type { NewUser } from '../../shared/schemas/user.ts';
import config from '../config.ts';
import { UnauthorizedError } from '../errors.ts';

export const OAUTH_STATE_COOKIE = '__Host-oauth_state';

const OAUTH_SCOPES = 'openid email profile';
const OAUTH_PROMPT = 'consent';

export const oauthClient = new OAuth2Client({
  clientId: config.googleClientId,
  clientSecret: config.googleClientSecret,
  redirectUri: config.googleRedirectUri,
});

export const generateAuthUrl = (state: string): string =>
  oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: OAUTH_SCOPES,
    prompt: OAUTH_PROMPT,
    include_granted_scopes: true,
    state,
  });

/**
 * Verifies an authorization code and exchanges it for user information.
 * @param oauthClient - Configured OAuth2Client instance
 * @param authCode - Authorization code from Google OAuth flow
 * @returns User data extracted from the ID token
 * @throws UnauthorizedError if code validation or token verification fails
 */
export async function verifyAuthCode(
  oauthClient: OAuth2Client,
  authCode: string,
): Promise<NewUser> {
  try {
    if (!authCode?.trim())
      throw new UnauthorizedError('Authorization code is missing or empty');

    const {
      tokens: { id_token },
    } = await oauthClient.getToken(authCode);
    if (!id_token) throw new UnauthorizedError('Missing id token');

    const ticket = await oauthClient.verifyIdToken({
      idToken: id_token,
      audience: config.googleClientId,
    });

    const tokenPayload = ticket.getPayload();

    if (!tokenPayload) throw new UnauthorizedError('Invalid token payload');

    return {
      googleId: tokenPayload.sub,
      name: tokenPayload.name ?? 'Unknown',
      email: tokenPayload.email ?? '',
      picture: tokenPayload.picture ?? '',
    };
  } catch (error) {
    throw new UnauthorizedError(
      `Token exchange failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
