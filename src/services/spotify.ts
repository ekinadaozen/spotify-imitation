/**
 * Spotify Web API service
 * Simple fetch wrappers — no unnecessary abstractions
 */
import { SPOTIFY_API } from '../constants/api';
import type {
  SpotifyUser,
  SpotifySearchResult,
  SpotifyNewReleases,
  SpotifyFeaturedPlaylists,
  SpotifyRecentlyPlayed,
  SpotifyRecommendations,
  SpotifyTrack,
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyCategory,
  SpotifyPaginatedResponse,
  SpotifyPlaylistTrack,
} from '../types/spotify';

/**
 * Base fetch helper with authorization header
 */
async function spotifyFetch<T>(
  endpoint: string,
  accessToken: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${SPOTIFY_API.BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.error?.message ?? `Spotify API error: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

// ─── User ────────────────────────────────────────────────

export function getMe(token: string): Promise<SpotifyUser> {
  return spotifyFetch<SpotifyUser>('/me', token);
}

// ─── Browse ──────────────────────────────────────────────

export function getNewReleases(
  token: string,
  limit = 20
): Promise<SpotifyNewReleases> {
  return spotifyFetch<SpotifyNewReleases>(
    `/browse/new-releases?limit=${limit}`,
    token
  );
}

export function getFeaturedPlaylists(
  token: string,
  limit = 20
): Promise<SpotifyFeaturedPlaylists> {
  return spotifyFetch<SpotifyFeaturedPlaylists>(
    `/browse/featured-playlists?limit=${limit}`,
    token
  );
}

export function getCategories(
  token: string,
  limit = 20
): Promise<{ categories: SpotifyPaginatedResponse<SpotifyCategory> }> {
  return spotifyFetch(
    `/browse/categories?limit=${limit}`,
    token
  );
}

// ─── Search ──────────────────────────────────────────────

export function search(
  token: string,
  query: string,
  types: string[] = ['track', 'artist', 'album', 'playlist'],
  limit = 20
): Promise<SpotifySearchResult> {
  const typeParam = types.join(',');
  return spotifyFetch<SpotifySearchResult>(
    `/search?q=${encodeURIComponent(query)}&type=${typeParam}&limit=${limit}`,
    token
  );
}

// ─── Tracks ──────────────────────────────────────────────

export function getTrack(
  token: string,
  trackId: string
): Promise<SpotifyTrack> {
  return spotifyFetch<SpotifyTrack>(`/tracks/${trackId}`, token);
}

// ─── Albums ──────────────────────────────────────────────

export function getAlbum(
  token: string,
  albumId: string
): Promise<SpotifyAlbum> {
  return spotifyFetch<SpotifyAlbum>(`/albums/${albumId}`, token);
}

export function getAlbumTracks(
  token: string,
  albumId: string,
  limit = 50
): Promise<SpotifyPaginatedResponse<SpotifyTrack>> {
  return spotifyFetch(`/albums/${albumId}/tracks?limit=${limit}`, token);
}

// ─── Artists ─────────────────────────────────────────────

export function getArtist(
  token: string,
  artistId: string
): Promise<SpotifyArtist> {
  return spotifyFetch<SpotifyArtist>(`/artists/${artistId}`, token);
}

export function getArtistTopTracks(
  token: string,
  artistId: string,
  market = 'US'
): Promise<{ tracks: SpotifyTrack[] }> {
  return spotifyFetch(
    `/artists/${artistId}/top-tracks?market=${market}`,
    token
  );
}

// ─── Recently Played ─────────────────────────────────────

export function getRecentlyPlayed(
  token: string,
  limit = 20
): Promise<SpotifyRecentlyPlayed> {
  return spotifyFetch<SpotifyRecentlyPlayed>(
    `/me/player/recently-played?limit=${limit}`,
    token
  );
}

// ─── Recommendations ─────────────────────────────────────

export function getRecommendations(
  token: string,
  seedTrackIds: string[],
  limit = 20
): Promise<SpotifyRecommendations> {
  const seeds = seedTrackIds.slice(0, 5).join(',');
  return spotifyFetch<SpotifyRecommendations>(
    `/recommendations?seed_tracks=${seeds}&limit=${limit}`,
    token
  );
}

// ─── Playlist Tracks ─────────────────────────────────────

export function getPlaylistTracks(
  token: string,
  playlistId: string,
  limit = 50
): Promise<SpotifyPaginatedResponse<SpotifyPlaylistTrack>> {
  return spotifyFetch(
    `/playlists/${playlistId}/tracks?limit=${limit}`,
    token
  );
}

// ─── User Top Items ──────────────────────────────────────

export function getTopTracks(
  token: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit = 20
): Promise<SpotifyPaginatedResponse<SpotifyTrack>> {
  return spotifyFetch(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    token
  );
}

export function getTopArtists(
  token: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit = 20
): Promise<SpotifyPaginatedResponse<SpotifyArtist>> {
  return spotifyFetch(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    token
  );
}
