/**
 * Supabase database types
 * These mirror the tables we create in Supabase
 */

export interface Profile {
  id: string;
  spotify_id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface LikedSong {
  id: string;
  user_id: string;
  spotify_track_id: string;
  track_name: string;
  artist_name: string;
  album_name: string;
  album_image_url: string | null;
  preview_url: string | null;
  duration_ms: number;
  liked_at: string;
}

export interface UserPlaylist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  spotify_track_id: string;
  track_name: string;
  artist_name: string;
  album_image_url: string | null;
  preview_url: string | null;
  duration_ms: number;
  added_at: string;
  position: number;
}

/**
 * Supabase Database schema type for type-safe queries
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      liked_songs: {
        Row: LikedSong;
        Insert: Omit<LikedSong, 'id' | 'liked_at'>;
        Update: Partial<Omit<LikedSong, 'id' | 'liked_at'>>;
      };
      playlists: {
        Row: UserPlaylist;
        Insert: Omit<UserPlaylist, 'id' | 'created_at'>;
        Update: Partial<Omit<UserPlaylist, 'id' | 'created_at'>>;
      };
      playlist_tracks: {
        Row: PlaylistTrack;
        Insert: Omit<PlaylistTrack, 'id' | 'added_at'>;
        Update: Partial<Omit<PlaylistTrack, 'id' | 'added_at'>>;
      };
    };
  };
}
