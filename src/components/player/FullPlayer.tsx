/**
 * Full-screen player modal
 * Shows large artwork, playback controls, seek bar, and track info
 */
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { formatDuration, formatArtists } from '../../utils/format';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { IconButton } from '../ui/IconButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ARTWORK_SIZE = SCREEN_WIDTH - 64;

export function FullPlayer() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { isLiked, toggleLike } = useLibraryStore();
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    shuffle,
    repeat,
    isFullPlayerOpen,
    closeFullPlayer,
    togglePlayPause,
    next,
    previous,
    toggleShuffle,
    toggleRepeat,
    seekTo,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progress = duration > 0 ? position / duration : 0;

  const handleLike = () => {
    if (user) {
      toggleLike(user.id, currentTrack);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSeek = (locationX: number) => {
    const seekBarWidth = SCREEN_WIDTH - 64;
    const ratio = Math.max(0, Math.min(1, locationX / seekBarWidth));
    seekTo(ratio * duration);
  };

  return (
    <Modal
      visible={isFullPlayerOpen}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <LinearGradient
        colors={['#1a1a2e', Colors.background]}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeFullPlayer} hitSlop={12}>
            <Ionicons
              name="chevron-down"
              size={28}
              color={Colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity hitSlop={12}>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Artwork */}
        <View style={styles.artworkContainer}>
          {currentTrack.album.images?.[0]?.url ? (
            <Image
              source={{ uri: currentTrack.album.images[0].url }}
              style={styles.artwork}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View style={[styles.artwork, styles.artworkPlaceholder]}>
              <Ionicons
                name="musical-note"
                size={64}
                color={Colors.textMuted}
              />
            </View>
          )}
        </View>

        {/* Track info + Like */}
        <View style={styles.trackInfo}>
          <View style={styles.trackTextContainer}>
            <Text style={styles.trackName} numberOfLines={1}>
              {currentTrack.name}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {formatArtists(currentTrack.artists)}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLike} hitSlop={8}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={24}
              color={liked ? Colors.primary : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Seek bar */}
        <View style={styles.seekContainer}>
          <TouchableOpacity
            onPress={(e) => handleSeek(e.nativeEvent.locationX)}
            style={styles.seekBarTouchable}
            activeOpacity={1}
          >
            <View style={styles.seekBar}>
              <View
                style={[
                  styles.seekProgress,
                  { width: `${progress * 100}%` },
                ]}
              >
                <View style={styles.seekThumb} />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.timeRow}>
            <Text style={styles.time}>
              {formatDuration(position * 1000)}
            </Text>
            <Text style={styles.time}>
              {formatDuration(duration * 1000)}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <IconButton
            name="shuffle"
            size={22}
            color={shuffle ? Colors.primary : Colors.textSecondary}
            onPress={() => {
              toggleShuffle();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
          <IconButton
            name="play-skip-back"
            size={28}
            color={Colors.text}
            onPress={() => {
              previous();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
          <IconButton
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={64}
            color={Colors.text}
            onPress={() => {
              togglePlayPause();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          />
          <IconButton
            name="play-skip-forward"
            size={28}
            color={Colors.text}
            onPress={() => {
              next();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
          <IconButton
            name={
              repeat === 'track'
                ? 'repeat'
                : repeat === 'queue'
                  ? 'repeat'
                  : 'repeat'
            }
            size={22}
            color={
              repeat !== 'off' ? Colors.primary : Colors.textSecondary
            }
            onPress={() => {
              toggleRepeat();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        </View>

        {/* Bottom spacer */}
        <View style={{ height: insets.bottom + 20 }} />
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    // Shadow for artwork
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: BorderRadius.lg,
  },
  artworkPlaceholder: {
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing['3xl'],
  },
  trackTextContainer: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  trackName: {
    color: Colors.text,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  trackArtist: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
  },
  seekContainer: {
    marginTop: Spacing['2xl'],
  },
  seekBarTouchable: {
    paddingVertical: Spacing.sm,
  },
  seekBar: {
    height: 4,
    backgroundColor: Colors.progressBarBackground,
    borderRadius: 2,
    overflow: 'visible',
  },
  seekProgress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  seekThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.text,
    position: 'absolute',
    right: -6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  time: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
  },
});
