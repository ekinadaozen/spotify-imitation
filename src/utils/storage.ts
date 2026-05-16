/**
 * AsyncStorage helpers for simple key-value persistence
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SPOTIFY_TOKEN: 'spotify_access_token',
  SPOTIFY_REFRESH_TOKEN: 'spotify_refresh_token',
  SPOTIFY_TOKEN_EXPIRY: 'spotify_token_expiry',
  USER_PROFILE: 'user_profile',
} as const;

export async function saveSpotifyTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): Promise<void> {
  const expiry = Date.now() + expiresIn * 1000;
  await AsyncStorage.multiSet([
    [KEYS.SPOTIFY_TOKEN, accessToken],
    [KEYS.SPOTIFY_REFRESH_TOKEN, refreshToken],
    [KEYS.SPOTIFY_TOKEN_EXPIRY, expiry.toString()],
  ]);
}

export async function getSpotifyTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  expiry: number | null;
}> {
  const values = await AsyncStorage.multiGet([
    KEYS.SPOTIFY_TOKEN,
    KEYS.SPOTIFY_REFRESH_TOKEN,
    KEYS.SPOTIFY_TOKEN_EXPIRY,
  ]);
  return {
    accessToken: values[0][1],
    refreshToken: values[1][1],
    expiry: values[2][1] ? parseInt(values[2][1], 10) : null,
  };
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([
    KEYS.SPOTIFY_TOKEN,
    KEYS.SPOTIFY_REFRESH_TOKEN,
    KEYS.SPOTIFY_TOKEN_EXPIRY,
    KEYS.USER_PROFILE,
  ]);
}

export async function isTokenExpired(): Promise<boolean> {
  const { expiry } = await getSpotifyTokens();
  if (!expiry) return true;
  // Consider expired if less than 5 minutes remaining
  return Date.now() > expiry - 5 * 60 * 1000;
}
