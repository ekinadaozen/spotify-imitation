/**
 * Library store — manages liked songs and user playlists
 * Data is persisted in Supabase
 */
import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { LikedSong, UserPlaylist, PlaylistTrack } from '../types/supabase';
import type { SpotifyTrack } from '../types/spotify';

interface LibraryState {
  likedSongs: LikedSong[];
  playlists: UserPlaylist[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLikedSongs: (userId: string) => Promise<void>;
  fetchPlaylists: (userId: string) => Promise<void>;
  toggleLike: (userId: string, track: SpotifyTrack) => Promise<void>;
  isLiked: (trackId: string) => boolean;
  createPlaylist: (
    userId: string,
    name: string,
    description?: string
  ) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addToPlaylist: (playlistId: string, track: SpotifyTrack) => Promise<void>;
  removeFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  getPlaylistTracks: (playlistId: string) => Promise<PlaylistTrack[]>;
}

export const useLibraryStore = create<LibraryState>()((set, get) => ({
  likedSongs: [],
  playlists: [],
  isLoading: false,
  error: null,

  fetchLikedSongs: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('liked_songs')
        .select('*')
        .eq('user_id', userId)
        .order('liked_at', { ascending: false });

      if (error) throw error;
      set({ likedSongs: data ?? [], isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch liked songs',
        isLoading: false,
      });
    }
  },

  fetchPlaylists: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ playlists: data ?? [], isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch playlists',
        isLoading: false,
      });
    }
  },

  toggleLike: async (userId, track) => {
    const { likedSongs } = get();
    const isCurrentlyLiked = likedSongs.some(
      (s) => s.spotify_track_id === track.id
    );

    if (isCurrentlyLiked) {
      // Unlike
      const { error } = await supabase
        .from('liked_songs')
        .delete()
        .eq('user_id', userId)
        .eq('spotify_track_id', track.id);

      if (!error) {
        set({
          likedSongs: likedSongs.filter(
            (s) => s.spotify_track_id !== track.id
          ),
        });
      } else {
        console.error('Error unliking song:', error);
      }
    } else {
      // Like
      const newLike = {
        user_id: userId,
        spotify_track_id: track.id,
        track_name: track.name,
        artist_name: track.artists.map((a) => a.name).join(', '),
        album_name: track.album.name,
        album_image_url: track.album.images?.[0]?.url ?? null,
        preview_url: track.preview_url,
        duration_ms: track.duration_ms,
      };

      const { data, error } = await supabase
        .from('liked_songs')
        .insert(newLike as never)
        .select()
        .single();

      if (!error && data) {
        set({ likedSongs: [data, ...likedSongs] });
      } else if (error) {
        console.error('Error liking song:', error);
      }
    }
  },

  isLiked: (trackId) => {
    return get().likedSongs.some((s) => s.spotify_track_id === trackId);
  },

  createPlaylist: async (userId, name, description) => {
    const { playlists } = get();
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: userId,
        name,
        description: description ?? null,
        cover_image_url: null,
      } as never)
      .select()
      .single();

    if (!error && data) {
      set({ playlists: [data, ...playlists] });
    }
  },

  deletePlaylist: async (playlistId) => {
    const { playlists } = get();
    // Delete associated tracks first
    await supabase.from('playlist_tracks').delete().eq('playlist_id', playlistId);
    const { error } = await supabase.from('playlists').delete().eq('id', playlistId);

    if (!error) {
      set({ playlists: playlists.filter((p) => p.id !== playlistId) });
    }
  },

  addToPlaylist: async (playlistId, track) => {
    // Get current max position
    const { data: existing } = await supabase
      .from('playlist_tracks')
      .select('position')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = (existing as { position: number }[] | null)?.[0]
      ? (existing as { position: number }[])[0].position + 1
      : 0;

    await supabase.from('playlist_tracks').insert({
      playlist_id: playlistId,
      spotify_track_id: track.id,
      track_name: track.name,
      artist_name: track.artists.map((a) => a.name).join(', '),
      album_image_url: track.album.images?.[0]?.url ?? null,
      preview_url: track.preview_url,
      duration_ms: track.duration_ms,
      position: nextPosition,
    } as never);
  },

  removeFromPlaylist: async (playlistId, trackId) => {
    await supabase
      .from('playlist_tracks')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('spotify_track_id', trackId);
  },

  getPlaylistTracks: async (playlistId) => {
    const { data } = await supabase
      .from('playlist_tracks')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true });

    return data ?? [];
  },
}));
