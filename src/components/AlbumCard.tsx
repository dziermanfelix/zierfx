'use client';

import { AlbumWithTracks, ArtistWithAlbumAndTracks, TrackWithAlbumAndArtist } from '@/types/music';
import Link from 'next/link';
import { makeAlbumLink } from '@/utils/slugify';
import { formatDate } from '@/utils/formatting';
import AlbumCover from './AlbumCover';
import { useIsMobile } from '@/utils/mobile';
import { Play } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';

interface AlbumCardProps {
  artist: ArtistWithAlbumAndTracks;
  album: AlbumWithTracks;
  search: string;
  filterBy: string;
}

const AlbumCard = ({ artist, album, search, filterBy }: AlbumCardProps) => {
  const isMobile = useIsMobile();
  const { setPlaylistAndPlay } = usePlayer();

  const tracks: TrackWithAlbumAndArtist[] = album.tracks.map((track) => ({
    ...track,
    album: { ...album, artist },
    artist, // Flatten artist for easier access
  }));

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlaylistAndPlay(tracks, 0);
  };

  return (
    <div className='group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-black hover:-translate-y-1'>
      <Link key={album.id} href={makeAlbumLink(artist.slug, album.slug, search, filterBy)} className='block'>
        <div className='p-4'>
          {/* Album Cover */}
          <div className='relative overflow-hidden rounded-xl mb-4 aspect-square'>
            <div className='absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'></div>
            <AlbumCover src={album.artworkUrl} alt={album.name} dim={isMobile ? 280 : 280} />

            {/* Play Button Overlay */}
            <button
              onClick={handlePlayClick}
              className='absolute bottom-3 right-3 bg-black hover:bg-gray-800 text-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20'
              aria-label={`Play ${album.name}`}
            >
              <Play className='w-5 h-5' fill='white' />
            </button>
          </div>

          {/* Album Info */}
          <div className='space-y-1'>
            <h3 className='font-bold text-gray-900 text-lg truncate group-hover:text-black transition-colors'>
              {album.name}
            </h3>
            <p className='text-gray-600 text-sm truncate'>{artist.name}</p>
            <div className='flex items-center gap-2 text-xs text-gray-500 pt-1'>
              <span className='bg-gray-100 px-2 py-1 rounded-full'>{formatDate(album.releaseDate)}</span>
              <span className='bg-gray-100 px-2 py-1 rounded-full'>
                {album.tracks.length} {album.tracks.length === 1 ? 'track' : 'tracks'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Mobile Play Button - Always Visible */}
      {isMobile && (
        <button
          onClick={handlePlayClick}
          className='absolute bottom-4 right-4 bg-black hover:bg-gray-800 text-white rounded-full p-3 shadow-lg active:scale-95 transition-transform z-20'
          aria-label={`Play ${album.name}`}
        >
          <Play className='w-5 h-5' fill='white' />
        </button>
      )}
    </div>
  );
};
export default AlbumCard;
