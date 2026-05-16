/**
 * Track list component using FlatList
 */
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { TrackItem } from './TrackItem';
import { EmptyState } from '../common/EmptyState';
import type { SpotifyTrack } from '../../types/spotify';

interface TrackListProps {
  tracks: SpotifyTrack[];
  showIndex?: boolean;
  showImage?: boolean;
  ListHeaderComponent?: React.ReactElement;
}

export function TrackList({
  tracks,
  showIndex = false,
  showImage = true,
  ListHeaderComponent,
}: TrackListProps) {
  if (tracks.length === 0 && !ListHeaderComponent) {
    return (
      <EmptyState
        title="No tracks found"
        message="Try searching for something else"
      />
    );
  }

  return (
    <FlatList
      data={tracks}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TrackItem
          track={item}
          tracks={tracks}
          index={showIndex ? index : undefined}
          showImage={showImage}
        />
      )}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120, // Space for mini player + tab bar
  },
  separator: {
    height: 1,
  },
});
