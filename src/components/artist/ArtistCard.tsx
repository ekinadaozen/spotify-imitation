/**
 * Artist card — circular image with name
 */
import React from 'react';
import { Card } from '../ui/Card';
import type { SpotifyArtist } from '../../types/spotify';
import { getBestImage } from '../../utils/format';

interface ArtistCardProps {
  artist: SpotifyArtist;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function ArtistCard({ artist, onPress, size = 'md' }: ArtistCardProps) {
  return (
    <Card
      title={artist.name}
      subtitle="Artist"
      imageUrl={getBestImage(artist.images)}
      onPress={onPress}
      size={size}
      rounded
    />
  );
}
