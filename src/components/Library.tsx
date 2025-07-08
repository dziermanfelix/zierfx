'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';
import { Album, Track } from '@prisma/client';
import { ArtistWithAlbumsAndTracks } from '@/types/music';

type Props = {
  artists: ArtistWithAlbumsAndTracks[];
};

export default function Library({ artists }: Props) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  const initialFilter = (searchParams.get('filter') as 'artist' | 'album' | 'track') ?? 'artist';
  const [search, setSearch] = useState(initialSearch);
  const [filterBy, setFilterBy] = useState<'artist' | 'album' | 'track'>(initialFilter);

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filterBy) params.set('filter', filterBy);

    router.replace(`/?${params.toString()}`);
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
    <div className='space-y-3'>
      <div className='flex gap-4 items-center'>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search'
          className='border p-1 rounded w-full max-w-sm'
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

      {filteredArtists.map((artist) => (
        <div key={artist.id} className='p-2 shadow'>
          <h2 className='text-xl font-semibold text-center'>{artist.name}</h2>

          {artist.albums.map((album) => (
            <Link
              key={album.id}
              href={`/albums/${slugify(artist.name)}/${slugify(album.name)}?search=${encodeURIComponent(
                search
              )}&filter=${filterBy}`}
              className='block mt-2 ml-4 border m-2 p-4 rounded-xl shadow hover:bg-gray-100 transition'
            >
              <h3 className='text-lg font-medium'>
                {album.name} ({album.year})
              </h3>
              <ul className='list-disc ml-5'>
                {album.tracks.map((track) => (
                  <li key={track.id}>{track.name}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
