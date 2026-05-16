/**
 * Playlist card for library view
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

interface PlaylistCardProps {
  name: string;
  trackCount?: number;
  imageUrl?: string | null;
  onPress?: () => void;
}

export function PlaylistCard({
  name,
  trackCount,
  onPress,
}: PlaylistCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={styles.coverArt}>
        <Ionicons
          name="musical-notes"
          size={24}
          color={Colors.textSecondary}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.meta}>
          Playlist{trackCount !== undefined ? ` · ${trackCount} songs` : ''}
        </Text>
      </View>
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
  coverArt: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    marginBottom: 2,
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
});
