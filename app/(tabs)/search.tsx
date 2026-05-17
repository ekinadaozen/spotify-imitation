/**
 * Search screen — debounced search with results and genre browse
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/spacing';
import { FontSize, FontWeight } from '../../src/constants/typography';
import { SearchInput } from '../../src/components/ui/Input';
import { TrackItem } from '../../src/components/track/TrackItem';
import { ArtistCard } from '../../src/components/artist/ArtistCard';
import { AlbumCard } from '../../src/components/album/AlbumCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { useSpotifyApi } from '../../src/hooks/useSpotifyApi';
import { search, getCategories } from '../../src/services/spotify';
import type {
  SpotifyTrack, SpotifyArtist, SpotifyAlbum, SpotifyCategory,
} from '../../src/types/spotify';

type SearchTab = 'songs' | 'artists' | 'albums';

const GENRE_COLORS = [
  '#E13300', '#1DB954', '#509BF5', '#AF2896',
  '#E8115B', '#148A08', '#E91429', '#7358FF',
  '#F59B23', '#1E3264', '#8D67AB', '#E61E32',
  '#477D95', '#BA5D07', '#DC148C', '#27856A',
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { callSpotify } = useSpotifyApi();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('songs');
  const [isSearching, setIsSearching] = useState(false);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [categories, setCategories] = useState<SpotifyCategory[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callSpotify((t) => getCategories(t, 20))
      .then((res) => setCategories(res.categories.items))
      .catch(() => {});
  }, [callSpotify]);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!text.trim()) {
      setTracks([]); setArtists([]); setAlbums([]); setIsSearching(false);
      return;
    }
    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const r = await callSpotify((t) => search(t, text, ['track', 'artist', 'album'], 20));
        setTracks(r.tracks?.items ?? []);
        setArtists(r.artists?.items ?? []);
        setAlbums(r.albums?.items ?? []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, [callSpotify]);

  const hasResults = query.trim().length > 0;
  const tabs: { key: SearchTab; label: string }[] = [
    { key: 'songs', label: 'Songs' },
    { key: 'artists', label: 'Artists' },
    { key: 'albums', label: 'Albums' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <SearchInput value={query} onChangeText={handleSearch} />
      </View>

      {!hasResults ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.catContainer}>
          <Text style={styles.sectionTitle}>Browse All</Text>
          <View style={styles.catGrid}>
            {categories.map((cat, idx) => (
              <TouchableOpacity key={cat.id} activeOpacity={0.7}
                style={[styles.catCard, { backgroundColor: GENRE_COLORS[idx % GENRE_COLORS.length] }]}>
                <Text style={styles.catName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isSearching ? (
            <View style={styles.loading}>
              <ActivityIndicator color={Colors.primary} size="large" />
            </View>
          ) : (
            <>
              {activeTab === 'songs' && (
                tracks.length > 0 ? (
                  <FlatList data={tracks} keyExtractor={(i) => i.id}
                    renderItem={({ item }) => <TrackItem track={item} tracks={tracks} />}
                    contentContainerStyle={{ paddingBottom: 120 }} />
                ) : <EmptyState title="No songs found" message={`No results for "${query}"`} />
              )}
              {activeTab === 'artists' && (
                artists.length > 0 ? (
                  <FlatList data={artists} numColumns={2} keyExtractor={(i) => i.id}
                    contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 120 }}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: Spacing.lg }}
                    renderItem={({ item }) => <ArtistCard artist={item} size="md" />} />
                ) : <EmptyState title="No artists found" icon="person-outline" />
              )}
              {activeTab === 'albums' && (
                albums.length > 0 ? (
                  <FlatList data={albums} numColumns={2} keyExtractor={(i) => i.id}
                    contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 120 }}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: Spacing.lg }}
                    renderItem={({ item }) => <AlbumCard album={item} size="md" />} />
                ) : <EmptyState title="No albums found" icon="disc-outline" />
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  title: { color: Colors.text, fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, marginTop: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { color: Colors.text, fontSize: FontSize.xl, fontWeight: FontWeight.bold, paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg, marginTop: Spacing.md },
  catContainer: { paddingBottom: 20 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.md, gap: Spacing.sm },
  catCard: { width: '47%', height: 100, borderRadius: BorderRadius.lg, padding: Spacing.md, overflow: 'hidden' },
  catName: { color: Colors.text, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.md },
  tab: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceLight },
  activeTab: { backgroundColor: Colors.primary },
  tabText: { color: Colors.text, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  activeTabText: { color: Colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
