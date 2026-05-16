/**
 * Album card — square image with name and artist
 */
import React from 'react';
import { Card } from '../ui/Card';
import type { SpotifyAlbum } from '../../types/spotify';
import { getBestImage, formatArtists } from '../../utils/format';

interface AlbumCardProps {
  album: SpotifyAlbum;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AlbumCard({ album, onPress, size = 'md' }: AlbumCardProps) {
  return (
    <Card
      title={album.name}
      subtitle={formatArtists(album.artists)}
      imageUrl={getBestImage(album.images)}
      onPress={onPress}
      size={size}
    />
  );
}
