'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AlbumInfo from '@/components/AlbumInfo';
import LibraryLink from '@/components/LIbraryLink';
import EditAlbumForm from '@/components/EditAlbumForm';

export default function EditAlbumPage() {
  const { artist, album } = useParams() as { artist: string; album: string };
  const [albumData, setAlbumData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/album/slug/${artist}/${album}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.album) {
          setAlbumData(data);
        }
      })
      .finally(() => setLoading(false));
  }, [artist, album]);

  if (loading) return <div className='p-8'>Loading...</div>;
  if (!albumData) return <div className='p-8 text-red-500'>Album not found.</div>;

  return (
    <main className='p-8 space-y-4'>
      <div className='p-2'>
        <LibraryLink />
      </div>

      <div className='border rounded p-2 m-2'>
        <h1>Page Preview:</h1>
        <AlbumInfo album={albumData.album} artistName={albumData.artistName} />
      </div>
      <EditAlbumForm
        album={albumData.album}
        artistName={albumData.artistName}
        onSaveSuccess={(updatedData) => setAlbumData({ ...albumData, album: updatedData })}
      />
    </main>
  );
}
