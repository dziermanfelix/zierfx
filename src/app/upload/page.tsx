'use client';

import LibraryLink from '@/components/LIbraryLink';
import { useState } from 'react';

export default function UploadPage() {
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [artwork, setArtwork] = useState<File | null>(null);
  const [tracks, setTracks] = useState<string[]>(['']);

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
      formData.append(`tracks[${index}]`, track);
    });

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Upload successful!');
      setArtist('');
      setAlbum('');
      setReleaseDate('');
      setArtwork(null);
      setTracks(['']);
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
              <div key={index} className='flex items-center gap-2'>
                <input
                  type='text'
                  placeholder={`Track ${index + 1}`}
                  value={track}
                  onChange={(e) => {
                    const updated = [...tracks];
                    updated[index] = e.target.value;
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
              onClick={() => setTracks([...tracks, ''])}
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
