'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import AlbumCover from '@/components/AlbumCover';
import { usePlayer } from '@/contexts/PlayerContext';
import { TrackWithAlbumAndArtist } from '@/types/music';

interface AlbumCoverProps {
  tracks: TrackWithAlbumAndArtist[];
}

export default function AlbumCoverWithPlay({ tracks }: AlbumCoverProps) {
  const { setPlaylistAndPlay } = usePlayer();
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayDisabled, setOverlayDisabled] = useState(false);

  const handlePlay = () => {
    setPlaylistAndPlay(tracks, 0);
    setShowOverlay(false);
    setOverlayDisabled(true);
  };

  const handleMouseEnter = () => {
    if (!overlayDisabled) setShowOverlay(true);
  };

  const handleMouseLeave = () => {
    setShowOverlay(false);
    setOverlayDisabled(false);
  };

  return (
    <div
      className='relative group w-fit p-2 mb-3 cursor-pointer'
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <AlbumCover src={tracks[0].album.artworkUrl} alt={`${tracks[0].album.name} artwork`} />
      {showOverlay && (
        <button
          onClick={handlePlay}
          className='absolute inset-0 flex items-center justify-center bg-opacity-50 text-white opacity-100 transition-opacity duration-300 cursor-pointer'
        >
          <Play className='w-20 h-20' />
        </button>
      )}
    </div>
  );
}
