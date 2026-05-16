/**
 * Audio player hook
 * Wraps expo-audio for simple playback control, synced with player store
 */
import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer as useExpoAudioPlayer, AudioModule } from 'expo-audio';
import { usePlayerStore } from '../store/usePlayerStore';

export function useAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    repeat,
    setPosition,
    setDuration,
    next,
    pause,
  } = usePlayerStore();

  const prevTrackIdRef = useRef<string | null>(null);
  const player = useExpoAudioPlayer(currentTrack?.preview_url ?? '');

  // Configure audio mode for playback
  useEffect(() => {
    AudioModule.setAudioModeAsync({
      playsInSilentMode: true,
    });
  }, []);

  // When track changes, load new audio
  useEffect(() => {
    if (!currentTrack?.preview_url) return;
    if (currentTrack.id === prevTrackIdRef.current) return;

    prevTrackIdRef.current = currentTrack.id;

    // The useAudioPlayer hook auto-loads when source changes
    // We just need to play
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // Player might not be ready yet
    }
  }, [currentTrack, player]);

  // Sync play/pause state
  useEffect(() => {
    if (!currentTrack?.preview_url) return;

    try {
      if (isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    } catch {
      // Player might not be ready
    }
  }, [isPlaying, player, currentTrack]);

  // Update position periodically
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      try {
        setPosition(player.currentTime);
        setDuration(player.duration);
      } catch {
        // Ignore if player not ready
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, player, setPosition, setDuration]);

  // Handle track end
  useEffect(() => {
    const checkEnd = setInterval(() => {
      try {
        if (
          player.duration > 0 &&
          player.currentTime >= player.duration - 0.5
        ) {
          if (repeat === 'track') {
            player.seekTo(0);
            player.play();
          } else {
            next();
          }
        }
      } catch {
        // Ignore
      }
    }, 1000);

    return () => clearInterval(checkEnd);
  }, [player, repeat, next]);

  const seekTo = useCallback(
    (position: number) => {
      try {
        player.seekTo(position);
        setPosition(position);
      } catch {
        // Ignore
      }
    },
    [player, setPosition]
  );

  return {
    seekTo,
    isReady: !!currentTrack?.preview_url,
  };
}
