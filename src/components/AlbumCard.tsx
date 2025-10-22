'use client';

import { AlbumWithTracks, ArtistWithAlbumAndTracks, TrackWithAlbumAndArtist } from '@/types/music';
import Link from 'next/link';
import { makeAlbumLink } from '@/utils/slugify';
import { formatDate } from '@/utils/formatting';
import AlbumCoverWithPlayButton from './AlbumCoverWithPlayButton';
import { useIsMobile } from '@/utils/mobile';

interface AlbumCardProps {
  artist: ArtistWithAlbumAndTracks;
  album: AlbumWithTracks;
  search: string;
  filterBy: string;
}

const AlbumCard = ({ artist, album, search, filterBy }: AlbumCardProps) => {
  const isMobile = useIsMobile();

  const tracks: TrackWithAlbumAndArtist[] = album.tracks.map((track) => ({
    ...track,
    album: { ...album, artist },
    artist, // Flatten artist for easier access
  }));

  return (
    <div className='group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-black hover:-translate-y-1'>
      <Link key={album.id} href={makeAlbumLink(artist.slug, album.slug, search, filterBy)} className='block'>
        <div className='p-4'>
          {/* Album Cover with Play Button */}
          <div className='mb-4'>
            <AlbumCoverWithPlayButton
              tracks={tracks}
              dim={isMobile ? 280 : 280}
              albumName={album.name}
              artworkUrl={album.artworkUrl}
            />
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
    </div>
  );
};
export default AlbumCard;
