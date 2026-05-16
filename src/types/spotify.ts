/**
 * Spotify Web API response types
 * Simplified types covering the endpoints we use
 */

// ─── Images ──────────────────────────────────────────────
export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

// ─── Artist ──────────────────────────────────────────────
export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  followers?: { total: number };
  uri: string;
  type: 'artist';
}

export interface SpotifyArtistSimple {
  id: string;
  name: string;
  uri: string;
  type: 'artist';
}

// ─── Album ───────────────────────────────────────────────
export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  artists: SpotifyArtistSimple[];
  release_date: string;
  total_tracks: number;
  uri: string;
  type: 'album';
  album_type: 'album' | 'single' | 'compilation';
}

// ─── Track ───────────────────────────────────────────────
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtistSimple[];
  album: SpotifyAlbum;
  duration_ms: number;
  preview_url: string | null;
  uri: string;
  track_number: number;
  explicit: boolean;
  type: 'track';
}

// ─── Playlist ────────────────────────────────────────────
export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
  };
  uri: string;
  type: 'playlist';
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  track: SpotifyTrack;
}

// ─── User ────────────────────────────────────────────────
export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
  country: string;
  product: string;
  followers: { total: number };
  uri: string;
}

// ─── Search ──────────────────────────────────────────────
export interface SpotifySearchResult {
  tracks?: SpotifyPaginatedResponse<SpotifyTrack>;
  artists?: SpotifyPaginatedResponse<SpotifyArtist>;
  albums?: SpotifyPaginatedResponse<SpotifyAlbum>;
  playlists?: SpotifyPaginatedResponse<SpotifyPlaylist>;
}

// ─── Recently Played ─────────────────────────────────────
export interface SpotifyRecentlyPlayed {
  items: Array<{
    track: SpotifyTrack;
    played_at: string;
  }>;
}

// ─── Paginated Response ──────────────────────────────────
export interface SpotifyPaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

// ─── New Releases ────────────────────────────────────────
export interface SpotifyNewReleases {
  albums: SpotifyPaginatedResponse<SpotifyAlbum>;
}

// ─── Featured Playlists ──────────────────────────────────
export interface SpotifyFeaturedPlaylists {
  message: string;
  playlists: SpotifyPaginatedResponse<SpotifyPlaylist>;
}

// ─── Recommendations ─────────────────────────────────────
export interface SpotifyRecommendations {
  tracks: SpotifyTrack[];
  seeds: Array<{
    id: string;
    type: string;
  }>;
}

// ─── Category ────────────────────────────────────────────
export interface SpotifyCategory {
  id: string;
  name: string;
  icons: SpotifyImage[];
}
