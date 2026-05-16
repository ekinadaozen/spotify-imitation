/**
 * Authentication service
 * Handles Spotify OAuth login/logout and token management
 */
import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from 'expo-auth-session';
import { SPOTIFY_API, SPOTIFY_SCOPES, APP_CONFIG } from '../constants/api';
import {
  saveSpotifyTokens,
  clearTokens,
  getSpotifyTokens,
} from '../utils/storage';

// Ensure the auth session completes properly
WebBrowser.maybeCompleteAuthSession();

/**
 * Spotify OAuth discovery document
 */
export const spotifyDiscovery = {
  authorizationEndpoint: SPOTIFY_API.AUTH_URL,
  tokenEndpoint: SPOTIFY_API.TOKEN_URL,
};

/**
 * Generate redirect URI for OAuth callback
 */
export function getRedirectUri(): string {
  return makeRedirectUri({
    scheme: APP_CONFIG.SCHEME,
    path: APP_CONFIG.REDIRECT_PATH,
  });
}

/**
 * Exchange authorization code for access/refresh tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? '';

  const response = await fetch(SPOTIFY_API.TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error_description ?? 'Token exchange failed');
  }

  const data = await response.json();

  // Save tokens to storage
  await saveSpotifyTokens(
    data.access_token,
    data.refresh_token,
    data.expires_in
  );

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = await getSpotifyTokens();
  if (!refreshToken) return null;

  const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? '';

  const response = await fetch(SPOTIFY_API.TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }).toString(),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  await saveSpotifyTokens(
    data.access_token,
    data.refresh_token ?? refreshToken,
    data.expires_in
  );

  return data.access_token;
}

/**
 * Logout — clear all stored tokens
 */
export async function logout(): Promise<void> {
  await clearTokens();
}

// Re-export for convenience
export { useAuthRequest, ResponseType, SPOTIFY_SCOPES };
