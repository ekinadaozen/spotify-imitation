/**
 * Profile screen — user info, stats, settings, logout
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius } from '../../src/constants/spacing';
import { FontSize, FontWeight } from '../../src/constants/typography';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useLibraryStore } from '../../src/store/useLibraryStore';
import { Avatar } from '../../src/components/ui/Avatar';
import { Button } from '../../src/components/ui/Button';
import { getBestImage, formatNumber } from '../../src/utils/format';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { likedSongs, playlists } = useLibraryStore();

  if (!user) return null;

  const avatarUrl = getBestImage(user.images, 200);

  const stats = [
    { label: 'Playlists', value: playlists.length },
    { label: 'Liked Songs', value: likedSongs.length },
    { label: 'Followers', value: user.followers?.total ?? 0 },
  ];

  const menuItems = [
    { icon: 'settings-outline' as const, label: 'Settings' },
    { icon: 'shield-checkmark-outline' as const, label: 'Privacy' },
    { icon: 'information-circle-outline' as const, label: 'About' },
    { icon: 'help-circle-outline' as const, label: 'Help & Support' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#1a1a2e', Colors.background]} style={styles.headerGradient}>
        <View style={styles.profileSection}>
          <Avatar uri={avatarUrl} size={100} fallback={user.display_name || '?'} />
          <Text style={styles.displayName}>{user.display_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.product && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{user.product.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(stat.value)}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.6}>
            <Ionicons name={item.icon} size={22} color={Colors.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <Button title="Log Out" onPress={logout} variant="secondary" fullWidth
          icon={<Ionicons name="log-out-outline" size={20} color={Colors.text} />} />
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerGradient: { paddingBottom: Spacing['2xl'] },
  profileSection: { alignItems: 'center', paddingTop: Spacing['3xl'], paddingBottom: Spacing.xl },
  displayName: { color: Colors.text, fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, marginTop: Spacing.lg },
  email: { color: Colors.textSecondary, fontSize: FontSize.md, marginTop: Spacing.xs },
  badge: { backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, marginTop: Spacing.sm },
  badgeText: { color: Colors.background, fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: Spacing['3xl'] },
  statItem: { alignItems: 'center' },
  statValue: { color: Colors.text, fontSize: FontSize['2xl'], fontWeight: FontWeight.bold },
  statLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  menu: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  menuLabel: { flex: 1, color: Colors.text, fontSize: FontSize.lg, marginLeft: Spacing.lg },
  logoutSection: { paddingHorizontal: Spacing.lg, paddingTop: Spacing['3xl'] },
  version: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center', marginTop: Spacing.xl },
});
