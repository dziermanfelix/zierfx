'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AlbumInfo from '@/components/AlbumInfo';
import LibraryLink from '@/components/LIbraryLink';
import EditAlbumForm from '@/components/EditAlbumForm';
import FormSection from '@/components/FormSection';
import { AlbumWithTracks } from '@/types/music';
import { Artist } from '@prisma/client';
import { routes } from '@/utils/routes';
import { ToastProvider } from '@/components/ToastContainer';

function EditAlbumPageContent() {
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

  if (loading)
    return (
      <div className='p-8 min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-pulse text-gray-600 text-lg'>Loading album...</div>
        </div>
      </div>
    );

  if (!album)
    return (
      <div className='p-8 min-h-screen bg-gray-50'>
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6'>
          <p className='text-red-500 text-center'>Album not found.</p>
        </div>
      </div>
    );

  if (!artist)
    return (
      <div className='p-8 min-h-screen bg-gray-50'>
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6'>
          <p className='text-red-500 text-center'>Artist not found.</p>
        </div>
      </div>
    );

  return (
    <main className='p-8 min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <FormSection>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Edit Album</h1>
              <p className='text-sm text-gray-500 mt-1'>
                {artist.name} - {album.name}
              </p>
            </div>
            <div className='flex space-x-3'>
              <a href='/admin' className='text-sm text-blue-600 hover:text-blue-800 underline'>
                Admin Dashboard
              </a>
              <LibraryLink />
              <button onClick={handleLogout} className='text-sm text-gray-600 hover:text-gray-800 underline'>
                Logout
              </button>
            </div>
          </div>
        </FormSection>

        {/* Page Preview */}
        <FormSection title='Preview'>
          <div className='border border-gray-200 rounded-lg p-4'>
            <AlbumInfo album={album} artist={artist} />
          </div>
        </FormSection>

        {/* Edit Form */}
        <EditAlbumForm
          album={album}
          artist={artist}
          onSaveSuccess={(updatedAlbum: AlbumWithTracks) => setAlbum(updatedAlbum)}
        />
      </div>
    </main>
  );
}

export default function EditAlbumPage() {
  return (
    <ToastProvider>
      <EditAlbumPageContent />
    </ToastProvider>
  );
}
