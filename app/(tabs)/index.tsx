/**
 * Home screen
 * Shows greeting, recently played, new releases, and featured playlists
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { Spacing } from '../../src/constants/spacing';
import { FontSize, FontWeight } from '../../src/constants/typography';
import { getGreeting, getBestImage, formatArtists } from '../../src/utils/format';
import { useSpotifyApi } from '../../src/hooks/useSpotifyApi';
import { useAuthStore } from '../../src/store/useAuthStore';
import { usePlayerStore } from '../../src/store/usePlayerStore';
import {
  getNewReleases,
  getFeaturedPlaylists,
  getRecentlyPlayed,
  getTopTracks,
} from '../../src/services/spotify';
import { Card } from '../../src/components/ui/Card';
import { AlbumCard } from '../../src/components/album/AlbumCard';
import { TrackItem } from '../../src/components/track/TrackItem';
import { LoadingScreen } from '../../src/components/common/LoadingScreen';
import { ErrorState } from '../../src/components/common/ErrorState';
import type {
  SpotifyAlbum,
  SpotifyPlaylist,
  SpotifyTrack,
} from '../../src/types/spotify';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { callSpotify } = useSpotifyApi();
  const { user } = useAuthStore();
  const { playTrackFromList } = usePlayerStore();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([]);
  const [newReleases, setNewReleases] = useState<SpotifyAlbum[]>([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);

      const [recentRes, releasesRes, featuredRes, topRes] =
        await Promise.allSettled([
          callSpotify((t) => getRecentlyPlayed(t, 10)),
          callSpotify((t) => getNewReleases(t, 10)),
          callSpotify((t) => getFeaturedPlaylists(t, 10)),
          callSpotify((t) => getTopTracks(t, 'short_term', 10)),
        ]);

      if (recentRes.status === 'fulfilled') {
        // Deduplicate recently played tracks
        const unique = recentRes.value.items.reduce<SpotifyTrack[]>(
          (acc, item) => {
            if (!acc.find((t) => t.id === item.track.id)) {
              acc.push(item.track);
            }
            return acc;
          },
          []
        );
        setRecentTracks(unique);
      }

      if (releasesRes.status === 'fulfilled') {
        setNewReleases(releasesRes.value.albums.items);
      }

      if (featuredRes.status === 'fulfilled') {
        setFeaturedPlaylists(featuredRes.value.playlists.items);
      }

      if (topRes.status === 'fulfilled') {
        setTopTracks(topRes.value.items);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load data'
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [callSpotify]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading your music..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const greeting = getGreeting();
  const firstName = user?.display_name?.split(' ')[0] ?? 'there';

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Greeting */}
      <Text style={styles.greeting}>
        {greeting}, {firstName}
      </Text>

      {/* Recently Played */}
      {recentTracks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Played</Text>
          <FlatList
            data={recentTracks}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <Card
                title={item.name}
                subtitle={formatArtists(item.artists)}
                imageUrl={getBestImage(item.album.images, 150)}
                onPress={() => playTrackFromList(item, recentTracks)}
                size="sm"
              />
            )}
          />
        </View>
      )}

      {/* New Releases */}
      {newReleases.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Releases</Text>
          <FlatList
            data={newReleases}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <AlbumCard album={item} size="md" />
            )}
          />
        </View>
      )}

      {/* Featured Playlists */}
      {featuredPlaylists.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Playlists</Text>
          <FlatList
            data={featuredPlaylists}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <Card
                title={item.name}
                subtitle={item.description ?? undefined}
                imageUrl={getBestImage(item.images, 150)}
                size="md"
              />
            )}
          />
        </View>
      )}

      {/* Top Tracks */}
      {topTracks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Top Tracks</Text>
          {topTracks.slice(0, 5).map((track) => (
            <TrackItem
              key={track.id}
              track={track}
              tracks={topTracks}
            />
          ))}
        </View>
      )}

      {/* Bottom spacing for mini player */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  greeting: {
    color: Colors.text,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  horizontalList: {
    paddingHorizontal: Spacing.lg,
  },
});
