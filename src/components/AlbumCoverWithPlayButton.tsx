'use client';

import { Play } from 'lucide-react';
import AlbumCover from '@/components/AlbumCover';
import { usePlayer } from '@/contexts/PlayerContext';
import { TrackWithAlbumAndArtist } from '@/types/music';
import { useIsMobile } from '@/utils/mobile';

interface AlbumCoverWithPlayButtonProps {
  tracks: TrackWithAlbumAndArtist[];
  dim?: number;
  albumName: string;
  artworkUrl?: string | null;
}

export default function AlbumCoverWithPlayButton({
  tracks,
  dim,
  albumName,
  artworkUrl,
}: AlbumCoverWithPlayButtonProps) {
  const { setPlaylistAndPlay } = usePlayer();
  const isMobile = useIsMobile();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlaylistAndPlay(tracks, 0);
  };

  return (
    <div className='relative overflow-hidden rounded-xl aspect-square group'>
      {/* Gradient overlay on hover (desktop only) */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'></div>

      <AlbumCover src={artworkUrl} alt={albumName} dim={dim} />

      {/* Play Button Overlay - Hidden on desktop, visible on mobile */}
      <button
        onClick={handlePlayClick}
        className={`absolute bottom-3 right-3 bg-black hover:bg-gray-800 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-20 ${
          isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        aria-label={`Play ${albumName}`}
      >
        <Play className='w-5 h-5' fill='white' />
      </button>
    </div>
  );
}
