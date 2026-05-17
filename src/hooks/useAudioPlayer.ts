import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer as useExpoAudioPlayer, useAudioPlayerStatus, AudioModule } from 'expo-audio';
import { usePlayerStore } from '../store/usePlayerStore';

export function useAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    repeat,
    setPosition,
    setDuration,
    next,
  } = usePlayerStore();

  const prevTrackIdRef = useRef<string | null>(null);
  
  // Use null instead of empty string if preview_url is missing
  const player = useExpoAudioPlayer(currentTrack?.preview_url ?? null);
  const status = useAudioPlayerStatus(player);

  // Configure audio mode for playback
  useEffect(() => {
    AudioModule.setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      allowsRecording: false,
      shouldPlayInBackground: false,
    });
  }, []);

  // When track changes, play it if it's new
  useEffect(() => {
    if (!currentTrack?.preview_url) return;
    if (currentTrack.id === prevTrackIdRef.current) return;

    prevTrackIdRef.current = currentTrack.id;

    try {
      player.play();
    } catch (e) {
      console.error('Error playing new track:', e);
    }
  }, [currentTrack, player]);

  // Sync play/pause state
  useEffect(() => {
    if (!currentTrack?.preview_url) return;

    try {
      if (isPlaying && !status.playing && status.isLoaded) {
        player.play();
      } else if (!isPlaying && status.playing) {
        player.pause();
      }
    } catch (e) {
      console.error('Error syncing play state:', e);
    }
  }, [isPlaying, player, currentTrack, status.playing, status.isLoaded]);

  // Update position reactively from status
  useEffect(() => {
    if (status.currentTime !== undefined) {
      setPosition(status.currentTime);
    }
    if (status.duration !== undefined && status.duration > 0) {
      setDuration(status.duration);
    }
  }, [status.currentTime, status.duration, setPosition, setDuration]);

  // Handle track end
  useEffect(() => {
    if (status.didJustFinish) {
      if (repeat === 'track') {
        player.seekTo(0);
        player.play();
      } else {
        next();
      }
    }
  }, [status.didJustFinish, player, repeat, next]);

  const seekTo = useCallback(
    (position: number) => {
      try {
        player.seekTo(position);
        setPosition(position);
      } catch (e) {
        console.error('Error seeking:', e);
      }
    },
    [player, setPosition]
  );

  return {
    seekTo,
    isReady: status.isLoaded,
  };
}
