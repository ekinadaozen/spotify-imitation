/**
 * Single track item row
 * Shows artwork, title, artist, duration, and like button
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { formatDuration, formatArtists } from '../../utils/format';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { SpotifyTrack } from '../../types/spotify';

interface TrackItemProps {
  track: SpotifyTrack;
  tracks: SpotifyTrack[]; // The full list (for queue)
  index?: number;
  showImage?: boolean;
}

export function TrackItem({
  track,
  tracks,
  index,
  showImage = true,
}: TrackItemProps) {
  const { playTrackFromList, currentTrack } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();
  const { user } = useAuthStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const liked = isLiked(track.id);

  const handlePress = () => {
    playTrackFromList(track, tracks);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLike = () => {
    if (user) {
      toggleLike(user.id, track);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.6}
      style={styles.container}
    >
      {index !== undefined && (
        <Text
          style={[styles.index, isCurrentTrack && styles.activeText]}
        >
          {index + 1}
        </Text>
      )}

      {showImage && (
        <View style={styles.imageContainer}>
          {track.album.images?.[0]?.url ? (
            <Image
              source={{ uri: track.album.images[0].url }}
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
      )}

      <View style={styles.info}>
        <Text
          style={[styles.title, isCurrentTrack && styles.activeText]}
          numberOfLines={1}
        >
          {track.name}
        </Text>
        <View style={styles.subtitleRow}>
          {track.explicit && (
            <View style={styles.explicitBadge}>
              <Text style={styles.explicitText}>E</Text>
            </View>
          )}
          <Text style={styles.artist} numberOfLines={1}>
            {formatArtists(track.artists)}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleLike} hitSlop={8}>
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={20}
          color={liked ? Colors.primary : Colors.textMuted}
        />
      </TouchableOpacity>

      <Text style={styles.duration}>
        {formatDuration(track.duration_ms)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  index: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    width: 28,
    textAlign: 'center',
  },
  imageContainer: {
    width: 48,
    height: 48,
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
    fontWeight: FontWeight.medium,
    marginBottom: 2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artist: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    flex: 1,
  },
  explicitBadge: {
    backgroundColor: Colors.textSecondary,
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginRight: 6,
  },
  explicitText: {
    color: Colors.background,
    fontSize: 9,
    fontWeight: FontWeight.bold,
  },
  activeText: {
    color: Colors.primary,
  },
  duration: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginLeft: Spacing.md,
    width: 40,
    textAlign: 'right',
  },
});
