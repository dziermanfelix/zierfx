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

    router.replace(`/library?${params.toString()}`);
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

  return (
    <div className='space-y-4'>
      <div className={`${isMobile ? 'flex flex-col gap-3 px-2' : 'ml-5 flex gap-4 items-center'}`}>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search'
          className={`border rounded p-1 w-full ${!isMobile && 'max-w-sm'}`}
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as 'artist' | 'album' | 'track')}
          className='border p-1 rounded'
        >
          <option value='artist'>Artist</option>
          <option value='album'>Album</option>
          <option value='track'>Track</option>
        </select>
      </div>
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1 px-2' : 'grid-cols-1 max-w-screen-lg mx-auto p-5'}`}>
        {filteredArtists.map((artist) =>
          artist.albums.map((album) => (
            <AlbumCard key={album.id} album={album} artist={artist} search={search} filterBy={filterBy} />
          ))
        )}
      </div>
    </div>
  );
}
