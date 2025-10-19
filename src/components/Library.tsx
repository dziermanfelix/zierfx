'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Album, Track } from '@prisma/client';
import { ArtistWithAlbumAndTracks } from '@/types/music';
import AlbumCard from './AlbumCard';
import { useIsMobile } from '@/utils/mobile';

type Props = {
  artists: ArtistWithAlbumAndTracks[];
};

export default function Library({ artists }: Props) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  const initialFilter = (searchParams.get('filter') as 'artist' | 'album' | 'track') ?? 'artist';
  const [search, setSearch] = useState(initialSearch);
  const [filterBy, setFilterBy] = useState<'artist' | 'album' | 'track'>(initialFilter);
  const isMobile = useIsMobile();

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filterBy) params.set('filter', filterBy);

    router.replace(`/music?${params.toString()}`);
  }, [search, filterBy]);

  const filteredArtists = useMemo(() => {
    if (!search.trim()) return artists;

    const query = search.toLowerCase();

    return artists.flatMap((artist) => {
      const artistMatch = artist.name.toLowerCase().includes(query);

      const filteredAlbums = artist.albums
        .map((album) => {
          const albumMatch = album.name.toLowerCase().includes(query);
          const filteredTracks = album.tracks.filter((track) => track.name.toLowerCase().includes(query));

          if (filterBy === 'track' && filteredTracks.length > 0) {
            return { ...album, tracks: filteredTracks };
          }

          if (filterBy === 'album' && albumMatch) {
            return album;
          }

          return null;
        })
        .filter((a): a is Album & { tracks: Track[] } => a !== null);

      if (filterBy === 'artist' && artistMatch) return [artist];
      if (filteredAlbums.length > 0) return [{ ...artist, albums: filteredAlbums }];
      return [];
    });
  }, [search, filterBy, artists]);

  const totalAlbums = filteredArtists.reduce((acc, artist) => acc + artist.albums.length, 0);

  return (
    <div className='space-y-8'>
      {/* Search and Filter Section */}
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1 relative'>
            <svg
              className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search your library...'
              className='w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 transition-all outline-none text-gray-800 placeholder-gray-400'
            />
          </div>
          <div className='relative'>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as 'artist' | 'album' | 'track')}
              className='appearance-none w-full sm:w-auto px-6 py-3 pr-10 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 transition-all outline-none text-gray-800 font-medium cursor-pointer bg-white'
            >
              <option value='artist'>Artist</option>
              <option value='album'>Album</option>
              <option value='track'>Track</option>
            </select>
            <svg
              className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </div>

        {/* Results Counter */}
        <div className='mt-4 text-sm text-gray-600'>
          {search ? (
            <span className='bg-gray-200 text-black px-3 py-1 rounded-full font-bold'>
              {totalAlbums} {totalAlbums === 1 ? 'result' : 'results'} found
            </span>
          ) : (
            <span className='text-gray-600 font-medium'>
              {totalAlbums} {totalAlbums === 1 ? 'release' : 'releases'}
            </span>
          )}
        </div>
      </div>

      {/* Albums Grid */}
      {totalAlbums === 0 ? (
        <div className='text-center py-16'>
          <div className='text-6xl mb-4'>🎵</div>
          <h3 className='text-2xl font-semibold text-gray-700 mb-2'>No results found</h3>
          <p className='text-gray-500'>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
        >
          {filteredArtists.map((artist) =>
            artist.albums.map((album) => (
              <AlbumCard key={album.id} album={album} artist={artist} search={search} filterBy={filterBy} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
