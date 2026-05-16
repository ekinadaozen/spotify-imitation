/**
 * Reusable Card component
 * Used for albums, playlists, and artist displays
 */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

interface CardProps {
  title: string;
  subtitle?: string;
  imageUrl: string | null;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean; // circular image (for artists)
  style?: ViewStyle;
}

const SIZES = {
  sm: 120,
  md: 150,
  lg: 180,
};

export function Card({
  title,
  subtitle,
  imageUrl,
  onPress,
  size = 'md',
  rounded = false,
  style,
}: CardProps) {
  const dimension = SIZES[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      style={[styles.container, { width: dimension }, style]}
    >
      <View
        style={[
          styles.imageContainer,
          {
            width: dimension,
            height: dimension,
            borderRadius: rounded ? dimension / 2 : BorderRadius.md,
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              {
                borderRadius: rounded ? dimension / 2 : BorderRadius.md,
              },
            ]}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              {
                borderRadius: rounded ? dimension / 2 : BorderRadius.md,
              },
            ]}
          >
            <Text style={styles.placeholderText}>♪</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle && (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: Spacing.md,
  },
  imageContainer: {
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: Colors.textMuted,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
  },
});
