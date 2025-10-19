'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AlbumInfo from '@/components/AlbumInfo';
import LibraryLink from '@/components/LIbraryLink';
import EditAlbumForm from '@/components/EditAlbumForm';
import { AlbumWithTracks } from '@/types/music';
import { Artist } from '@prisma/client';
import { routes } from '@/utils/routes';

export default function EditAlbumPage() {
  const router = useRouter();
  const { artist: artistParam, album: albumParam } = useParams() as { artist: string; album: string };
  const [album, setAlbum] = useState<AlbumWithTracks>();
  const [artist, setArtist] = useState<Artist>();
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(routes.HOME);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/album/slug/${artistParam}/${albumParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.album) {
          setAlbum(data.album);
        }
        if (data?.artist) {
          setArtist(data.artist);
        }
      })
      .finally(() => setLoading(false));
  }, [artistParam, albumParam]);

  if (loading) return <div className='p-8'>Loading...</div>;
  if (!album) return <div className='p-8 text-red-500'>Album not found.</div>;
  if (!artist) return <div className='p-8 text-red-500'>Artist not found.</div>;

  return (
    <main className='p-8 space-y-4'>
      <div className='p-2 flex justify-between items-center'>
        <LibraryLink />
        <button onClick={handleLogout} className='text-sm text-gray-600 hover:text-gray-800 underline'>
          Logout
        </button>
      </div>

      <div className='border rounded p-2 m-2'>
        <h1>Page Preview:</h1>
        <AlbumInfo album={album} artist={artist} />
      </div>
      <EditAlbumForm
        album={album}
        artist={artist}
        onSaveSuccess={(updatedAlbum: AlbumWithTracks) => setAlbum(updatedAlbum)}
      />
    </main>
  );
}
