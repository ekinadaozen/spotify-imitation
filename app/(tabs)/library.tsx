
/**
 * Library screen — Liked Songs & Playlists
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../../src/components/common/EmptyState';
import { LoadingScreen } from '../../src/components/common/LoadingScreen';
import { PlaylistCard } from '../../src/components/playlist/PlaylistCard';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/spacing';
import { FontSize, FontWeight } from '../../src/constants/typography';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useLibraryStore } from '../../src/store/useLibraryStore';
import { usePlayerStore } from '../../src/store/usePlayerStore';
import type { SpotifyTrack } from '../../src/types/spotify';

type LibTab = 'playlists' | 'liked';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { likedSongs, playlists, isLoading, fetchLikedSongs, fetchPlaylists, createPlaylist } = useLibraryStore();
  const { playTrackFromList } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<LibTab>('playlists');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (user) {
      fetchLikedSongs(user.id);
      fetchPlaylists(user.id);
    }
  }, [user, fetchLikedSongs, fetchPlaylists]);

  const handleCreate = async () => {
    if (!user || !newName.trim()) return;
    await createPlaylist(user.id, newName.trim());
    setNewName('');
    setShowCreate(false);
  };

  const likedAsTrack = (song: typeof likedSongs[0]): SpotifyTrack => ({
    id: song.spotify_track_id,
    name: song.track_name,
    artists: [{ id: '', name: song.artist_name, uri: '', type: 'artist' }],
    album: {
      id: '', name: song.album_name, images: song.album_image_url ? [{ url: song.album_image_url, height: 300, width: 300 }] : [],
      artists: [], release_date: '', total_tracks: 0, uri: '', type: 'album', album_type: 'album',
    },
    duration_ms: song.duration_ms,
    preview_url: song.preview_url,
    uri: '', track_number: 0, explicit: false, type: 'track',
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <TouchableOpacity onPress={() => setShowCreate(true)}>
          <Ionicons name="add-circle-outline" size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {(['playlists', 'liked'] as LibTab[]).map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'playlists' ? 'Playlists' : `Liked Songs (${likedSongs.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'playlists' ? (
        playlists.length === 0 ? (
          <EmptyState icon="musical-notes-outline" title="No playlists yet" message="Create your first playlist!" />
        ) : (
          <FlatList data={playlists} keyExtractor={(p) => p.id}
            renderItem={({ item }) => <PlaylistCard name={item.name} />}
            contentContainerStyle={{ paddingBottom: 120 }} />
        )
      ) : (
        likedSongs.length === 0 ? (
          <EmptyState icon="heart-outline" title="No liked songs" message="Like songs to see them here" />
        ) : (
          <FlatList data={likedSongs} keyExtractor={(s) => s.id}
            renderItem={({ item }) => {
              const track = likedAsTrack(item);
              return (
                <TouchableOpacity onPress={() => playTrackFromList(track, likedSongs.map(likedAsTrack))}
                  style={styles.likedRow}>
                  <View style={styles.likedInfo}>
                    <Text style={styles.likedTitle} numberOfLines={1}>{item.track_name}</Text>
                    <Text style={styles.likedArtist} numberOfLines={1}>{item.artist_name}</Text>
                  </View>
                  <Ionicons name="heart" size={18} color={Colors.primary} />
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 120 }} />
        )
      )}

      {/* Create Playlist Modal */}
      <Modal visible={showCreate} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Playlist</Text>
            <TextInput value={newName} onChangeText={setNewName} placeholder="Playlist name"
              placeholderTextColor={Colors.textMuted} style={styles.modalInput} autoFocus />
            <View style={styles.modalButtons}>
              <Button title="Cancel" variant="ghost" onPress={() => { setShowCreate(false); setNewName(''); }} />
              <Button title="Create" onPress={handleCreate} disabled={!newName.trim()} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, marginBottom: Spacing.lg },
  title: { color: Colors.text, fontSize: FontSize['3xl'], fontWeight: FontWeight.bold },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.lg },
  tab: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceLight },
  activeTab: { backgroundColor: Colors.primary },
  tabText: { color: Colors.text, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  activeTabText: { color: Colors.background },
  likedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
  likedInfo: { flex: 1, marginRight: Spacing.md },
  likedTitle: { color: Colors.text, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  likedArtist: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing['2xl'], width: '85%' },
  modalTitle: { color: Colors.text, fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: Spacing.lg },
  modalInput: { backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.md, padding: Spacing.md, color: Colors.text, fontSize: FontSize.md, marginBottom: Spacing.lg },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md },
});
