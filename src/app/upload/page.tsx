'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LibraryLink from '@/components/LIbraryLink';
import { routes } from '@/utils/routes';

export default function UploadPage() {
  const router = useRouter();
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [artwork, setArtwork] = useState<File | null>(null);
  const [tracks, setTracks] = useState<{ name: string; file: File | null }[]>([{ name: '', file: null }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('artist', artist);
    formData.append('album', album);
    formData.append('releaseDate', releaseDate);

    if (artwork) {
      formData.append('artwork', artwork);
    }

    tracks.forEach((track, index) => {
      formData.append(`tracks[${index}][name]`, track.name);
      if (track.file) {
        formData.append(`tracks[${index}][file]`, track.file);
      }
    });

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.replace(routes.HOME);
    } else {
      alert('Something went wrong.');
    }
  };

  return (
    <main className='p-8'>
      <div className='p-2'>
        <LibraryLink />
      </div>
      <div className='max-w-xl mx-auto space-y-4'>
        <h1 className='text-2xl font-bold'>New Release</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            placeholder='Artist Name'
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className='border p-2 w-full rounded'
            required
          />
          <input
            type='text'
            placeholder='Album Name'
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className='border p-2 w-full rounded'
            required
          />
          <input
            type='date'
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className='border p-2 w-full rounded'
            required
          />

          <input
            type='file'
            accept='image/*'
            onChange={(e) => setArtwork(e.target.files?.[0] || null)}
            className='border p-2 w-full rounded'
          />

          <div className='space-y-2'>
            <p className='font-medium'>Tracks:</p>
            {tracks.map((track, index) => (
              <div key={index} className='space-y-1'>
                <input
                  type='text'
                  placeholder={`Track ${index + 1} name`}
                  value={track.name}
                  onChange={(e) => {
                    const updated = [...tracks];
                    updated[index].name = e.target.value;
                    setTracks(updated);
                  }}
                  className='border p-2 rounded w-full'
                  required
                />

                <input
                  type='file'
                  accept='audio/*'
                  onChange={(e) => {
                    const updated = [...tracks];
                    updated[index].file = e.target.files?.[0] || null;
                    setTracks(updated);
                  }}
                  className='border p-2 rounded w-full'
                  required
                />

                <button
                  type='button'
                  onClick={() => {
                    const updated = [...tracks];
                    updated.splice(index, 1);
                    setTracks(updated);
                  }}
                  className='text-red-600 text-sm underline'
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={() => setTracks([...tracks, { name: '', file: null }])}
              className='text-blue-600 underline text-sm'
            >
              + Add Track
            </button>
          </div>

          <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
            Upload
          </button>
        </form>
      </div>
    </main>
  );
}
