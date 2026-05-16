/**
 * Authenticated Spotify API hook
 * Provides a fetch wrapper that auto-refreshes tokens when expired
 */
import { useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Returns a function to make authenticated Spotify API calls
 * Automatically refreshes the token if expired
 */
export function useSpotifyApi() {
  const { getValidToken } = useAuthStore();

  /**
   * Execute a Spotify API function with a valid token
   * Usage: const data = await callSpotify((token) => getNewReleases(token))
   */
  const callSpotify = useCallback(
    async <T>(apiCall: (token: string) => Promise<T>): Promise<T> => {
      const token = await getValidToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      return apiCall(token);
    },
    [getValidToken]
  );

  return { callSpotify };
}
