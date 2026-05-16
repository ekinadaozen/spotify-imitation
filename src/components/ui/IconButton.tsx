/**
 * Circular icon button (play, pause, like, etc.)
 */
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function IconButton({
  name,
  size = 24,
  color = Colors.text,
  backgroundColor,
  onPress,
  style,
  disabled = false,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      disabled={disabled}
      style={[
        backgroundColor
          ? [
              styles.circle,
              {
                backgroundColor,
                width: size * 1.8,
                height: size * 1.8,
                borderRadius: (size * 1.8) / 2,
              },
            ]
          : undefined,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
