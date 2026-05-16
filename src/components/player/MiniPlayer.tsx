/**
 * Mini player — fixed bottom bar showing current track
 * Tappable to open the full player
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeOutDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { formatArtists } from '../../utils/format';
import { usePlayerStore } from '../../store/usePlayerStore';

export function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    openFullPlayer,
    position,
    duration,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const progress = duration > 0 ? position / duration : 0;

  const handlePlayPause = () => {
    togglePlayPause();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(200)}
      style={styles.wrapper}
    >
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBar, { width: `${progress * 100}%` }]}
        />
      </View>

      <TouchableOpacity
        onPress={openFullPlayer}
        activeOpacity={0.9}
        style={styles.container}
      >
        {/* Album art */}
        <View style={styles.imageContainer}>
          {currentTrack.album.images?.[0]?.url ? (
            <Image
              source={{ uri: currentTrack.album.images[0].url }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="musical-note"
                size={20}
                color={Colors.textMuted}
              />
            </View>
          )}
        </View>

        {/* Track info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {formatArtists(currentTrack.artists)}
          </Text>
        </View>

        {/* Play/Pause button */}
        <TouchableOpacity
          onPress={handlePlayPause}
          hitSlop={12}
          style={styles.playButton}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color={Colors.text}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 80, // Above tab bar
    left: Spacing.sm,
    right: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: Colors.progressBarBackground,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  imageContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  artist: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 1,
  },
  playButton: {
    padding: Spacing.sm,
  },
});
