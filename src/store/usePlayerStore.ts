/**
 * Player store — manages audio playback state
 */
import { create } from 'zustand';
import type { SpotifyTrack } from '../types/spotify';

type RepeatMode = 'off' | 'track' | 'queue';

interface PlayerState {
  currentTrack: SpotifyTrack | null;
  queue: SpotifyTrack[];
  queueIndex: number;
  isPlaying: boolean;
  position: number; // seconds
  duration: number; // seconds
  shuffle: boolean;
  repeat: RepeatMode;
  isFullPlayerOpen: boolean;

  // Actions
  setTrack: (track: SpotifyTrack) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (position: number) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setQueue: (tracks: SpotifyTrack[], startIndex?: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  playTrackFromList: (track: SpotifyTrack, tracks: SpotifyTrack[]) => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  position: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',
  isFullPlayerOpen: false,

  setTrack: (track) =>
    set({ currentTrack: track, position: 0, isPlaying: true }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  next: () => {
    const { queue, queueIndex, repeat, shuffle } = get();
    if (queue.length === 0) return;

    let nextIndex: number;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (queueIndex < queue.length - 1) {
      nextIndex = queueIndex + 1;
    } else if (repeat === 'queue') {
      nextIndex = 0;
    } else {
      // End of queue, stop playing
      set({ isPlaying: false });
      return;
    }

    set({
      queueIndex: nextIndex,
      currentTrack: queue[nextIndex],
      position: 0,
      isPlaying: true,
    });
  },

  previous: () => {
    const { queue, queueIndex, position } = get();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart current track
    if (position > 3) {
      set({ position: 0 });
      return;
    }

    const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
    set({
      queueIndex: prevIndex,
      currentTrack: queue[prevIndex],
      position: 0,
      isPlaying: true,
    });
  },

  seekTo: (position) => set({ position }),

  setPosition: (position) => set({ position }),

  setDuration: (duration) => set({ duration }),

  setQueue: (tracks, startIndex = 0) =>
    set({
      queue: tracks,
      queueIndex: startIndex,
      currentTrack: tracks[startIndex] ?? null,
    }),

  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

  toggleRepeat: () =>
    set((state) => {
      const modes: RepeatMode[] = ['off', 'queue', 'track'];
      const currentIdx = modes.indexOf(state.repeat);
      return { repeat: modes[(currentIdx + 1) % modes.length] };
    }),

  openFullPlayer: () => set({ isFullPlayerOpen: true }),

  closeFullPlayer: () => set({ isFullPlayerOpen: false }),

  playTrackFromList: (track, tracks) => {
    if (!track.preview_url) {
      import('react-native').then(({ Alert }) => {
        Alert.alert('Preview Not Available', 'Spotify does not provide an audio preview for this track.');
      });
      return;
    }

    const index = tracks.findIndex((t) => t.id === track.id);
    set({
      currentTrack: track,
      queue: tracks,
      queueIndex: index >= 0 ? index : 0,
      position: 0,
      isPlaying: true,
    });
  },
}));
