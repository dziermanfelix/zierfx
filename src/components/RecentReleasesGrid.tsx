'use client';

import Link from 'next/link';
import { formatDate } from '@/utils/formatting';
import AlbumCoverWithPlayButton from './AlbumCoverWithPlayButton';
import { Album, Artist, Track } from '@prisma/client';
import { TrackWithAlbumAndArtist } from '@/types/music';

type AlbumWithRelations = Album & {
  artist: Artist;
  tracks: Track[];
};

interface RecentReleasesGridProps {
  albums: AlbumWithRelations[];
}

export default function RecentReleasesGrid({ albums }: RecentReleasesGridProps) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6'>
      {albums.map((album) => {
        const tracks: TrackWithAlbumAndArtist[] = album.tracks.map((track) => ({
          ...track,
          album: { ...album, artist: album.artist },
          artist: album.artist,
        }));

        return (
          <div key={album.id} className='group'>
            <Link href={`/albums/${album.artist.slug}/${album.slug}`} className='block'>
              <div className='space-y-3'>
                {/* Album Cover with Play Button */}
                <AlbumCoverWithPlayButton tracks={tracks} albumName={album.name} artworkUrl={album.artworkUrl} />

                {/* Album Info */}
                <div className='space-y-1'>
                  <h3 className='font-semibold line-clamp-1 group-hover:text-black transition-colors'>{album.name}</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1'>{album.artist.name}</p>
                  <p className='text-xs text-gray-500 dark:text-gray-500'>{formatDate(album.releaseDate)}</p>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
