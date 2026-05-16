/**
 * Spotify API configuration
 */
export const SPOTIFY_API = {
  BASE_URL: 'https://api.spotify.com/v1',
  AUTH_URL: 'https://accounts.spotify.com/authorize',
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
} as const;

/**
 * Spotify OAuth scopes needed for this app
 */
export const SPOTIFY_SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-read-recently-played',
  'user-top-read',
  'user-library-read',
  'user-library-modify',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'streaming',
] as const;

/**
 * App configuration
 */
export const APP_CONFIG = {
  SCHEME: 'myapp',
  REDIRECT_PATH: 'callback',
  APP_NAME: 'Spotify Imitation',
} as const;
