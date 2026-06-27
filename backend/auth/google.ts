import { OAuth2Client } from 'google-auth-library';

import type { NewUser } from '../../shared/schemas/user.ts';
import config from '../config.ts';
import { UnauthorizedError } from '../errors.ts';

export const OAUTH_STATE_COOKIE = '__Host-oauth_state';

export const oauthClient = new OAuth2Client({
  clientId: config.googleClientId,
  clientSecret: config.googleClientSecret,
  redirectUri: config.googleRedirectUri,
});

export const generateAuthUrl = (state: string): string =>
  oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: 'openid email profile',
    prompt: 'consent',
    include_granted_scopes: true,
    state,
  });

export async function verifyAuthCode(
  oauthClient: OAuth2Client,
  authCode: string
): Promise<NewUser> {
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
    name: tokenPayload.name,
    email: tokenPayload.email,
    picture: tokenPayload.picture,
  };
}
