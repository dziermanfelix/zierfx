'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AlbumInfo from '@/components/AlbumInfo';
import LibraryLink from '@/components/LIbraryLink';
import EditAlbumForm from '@/components/EditAlbumForm';

export default function EditAlbumPage() {
  const { artist: artistParam, album: albumParam } = useParams() as { artist: string; album: string };
  const [album, setAlbum] = useState<any>(null);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className='p-2'>
        <LibraryLink />
      </div>

      <div className='border rounded p-2 m-2'>
        <h1>Page Preview:</h1>
        <AlbumInfo album={album} artist={artist} />
      </div>
      <EditAlbumForm
        album={album}
        artist={artist}
        onSaveSuccess={(updatedData) => setAlbum({ ...album, album: updatedData })}
      />
    </main>
  );
}
