/**
 * Circular avatar component for user and artist photos
 */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../../constants/colors';

interface AvatarProps {
  uri: string | null;
  size?: number;
  fallback?: string; // First letter for fallback
}

export function Avatar({ uri, size = 48, fallback = '?' }: AvatarProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { borderRadius: size / 2 },
          ]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <Text style={[styles.fallback, { fontSize: size * 0.4 }]}>
          {fallback.charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    color: Colors.text,
    fontWeight: '600',
  },
});
