'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import LibraryLink from '@/components/LIbraryLink';
import MenuBar from '@/components/MenuBar';
import { routes } from '@/utils/routes';
import FileInput from '@/components/FileInput';

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [artwork, setArtwork] = useState<File | null>(null);
  const [tracks, setTracks] = useState<{ name: string; file: File | null }[]>([{ name: '', file: null }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

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
    setUploading(false);
  };

  return (
    <main className='p-8'>
      <MenuBar />
      <div className='p-2'>
        <Suspense fallback={<div>Loading Upload Page...</div>}>
          <LibraryLink />
        </Suspense>
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

          <FileInput
            className='pt-4 pb-4 w-full'
            accept='image/*'
            label='Album Artwork'
            onChange={(file) => setArtwork(file)}
          />

          <div className='space-y-2'>
            <p className='font-medium'>Tracks:</p>
            {tracks.map((track, index) => (
              <div key={index} className='p-1 w-full space-y-1'>
                <div className='flex flex-row space-x-2'>
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

                  <button
                    type='button'
                    className='std-link rounded p-1 text-red-600 text-sm'
                    onClick={() => {
                      const updated = [...tracks];
                      updated.splice(index, 1);
                      setTracks(updated);
                    }}
                  >
                    Delete
                  </button>
                </div>

                <FileInput
                  className='w-full pt-2'
                  accept='audio/*'
                  label={`Track ${index + 1} File`}
                  onChange={(file) => {
                    const updated = [...tracks];
                    updated[index].file = file;
                    setTracks(updated);
                  }}
                  required
                />
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

          <button disabled={uploading} type='submit' className='submit-btn'>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </main>
  );
}
