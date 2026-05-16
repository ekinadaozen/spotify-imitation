/**
 * Spotify OAuth hook
 * Wraps expo-auth-session for the Spotify PKCE flow
 */
import { useEffect, useCallback, useState } from 'react';
import { useAuthRequest } from 'expo-auth-session';
import {
  spotifyDiscovery,
  getRedirectUri,
  exchangeCodeForTokens,
} from '../services/auth';
import { getMe } from '../services/spotify';
import { useAuthStore } from '../store/useAuthStore';
import { SPOTIFY_SCOPES } from '../constants/api';

export function useSpotifyAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setToken } = useAuthStore();

  const redirectUri = getRedirectUri();
  const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? '';

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: [...SPOTIFY_SCOPES],
      usePKCE: true,
      redirectUri,
    },
    spotifyDiscovery
  );

  // Handle the OAuth response
  useEffect(() => {
    if (response?.type === 'success' && response.params.code) {
      handleAuthResponse(response.params.code);
    } else if (response?.type === 'error') {
      setError(response.error?.message ?? 'Authentication failed');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleAuthResponse = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const codeVerifier = request?.codeVerifier;
      if (!codeVerifier) {
        throw new Error('Missing code verifier');
      }

      // Exchange code for tokens
      const { accessToken } = await exchangeCodeForTokens(
        code,
        codeVerifier,
        redirectUri
      );

      // Fetch user profile
      const user = await getMe(accessToken);

      // Update store
      setToken(accessToken);
      setUser(user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Authentication failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async () => {
    setError(null);
    await promptAsync();
  }, [promptAsync]);

  return {
    login,
    isLoading,
    error,
    isReady: !!request,
  };
}
