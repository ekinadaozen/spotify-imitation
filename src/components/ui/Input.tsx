/**
 * Styled search input component
 */
import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { FontSize } from '../../constants/typography';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search songs, artists, albums...',
  autoFocus = false,
}: InputProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={Colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        style={styles.input}
      />
      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={20}
          color={Colors.textMuted}
          onPress={() => onChangeText('')}
          style={styles.clearIcon}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    height: '100%',
  },
  clearIcon: {
    marginLeft: Spacing.sm,
  },
});
