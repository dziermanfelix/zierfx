'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { AlbumSlim, TrackSlim } from '@/types/music';
import AlbumActions from './AlbumActions';
import { slugify } from '@/utils/slugify';

type AlbumInfoProps = {
  album: AlbumSlim;
  artistName: string;
  onSaveSuccess: (updatedAlbum: AlbumSlim) => void;
};

export default function EditAlbumForm({ album, artistName, onSaveSuccess }: AlbumInfoProps) {
  const router = useRouter();
  const [albumName, setAlbumName] = useState(album.name);
  const [artwork, setArtwork] = useState<File | null>(null);
  const [tracks, setTracks] = useState<TrackSlim[]>(
    album.tracks.map((track) => ({
      id: track.id,
      number: track.number,
      name: track.name,
      file: null,
    }))
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('albumName', albumName);
    if (artwork) formData.append('artwork', artwork);

    tracks.forEach((track, index) => {
      formData.append(`tracks[${index}][id]`, track.id.toString());
      formData.append(`tracks[${index}][name]`, track.name);
      // if (track.file) {
      //   formData.append(`tracks[${index}][file]`, track.file);
      // }
    });

    const res = await fetch(`/api/album/${album.id}`, {
      method: 'PATCH',
      body: formData,
    });

    if (res.ok) {
      const updated = await res.json();
      onSaveSuccess(updated.album);
      const newSlug = slugify(updated.album.name);
      const currentSlug = slugify(album.name);
      if (newSlug !== currentSlug) {
        router.replace(`/albums/${slugify(artistName)}/${newSlug}/edit`);
      }
    } else {
      alert('Update failed.');
    }
    setSaving(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h2 className='text-xl font-semibold'>Editing Album: {album.name}</h2>

        <input
          type='text'
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          className='border p-2 w-full rounded'
        />

        <div>
          <label className='block mb-1 font-medium'>Replace Artwork:</label>
          {album.artworkUrl && <img src={album.artworkUrl} alt='Current Artwork' className='h-32 rounded mb-2' />}
          <input type='file' accept='image/*' onChange={(e) => setArtwork(e.target.files?.[0] || null)} />
        </div>

        <div className='space-y-2'>
          <p className='font-medium'>Tracks:</p>
          {tracks.map((track, index) => (
            <div key={track.id} className='space-y-1'>
              <input
                type='text'
                value={track.name}
                onChange={(e) => {
                  const updated = [...tracks];
                  updated[index].name = e.target.value;
                  setTracks(updated);
                }}
                className='border p-2 rounded w-full'
              />

              {/* {track.audioUrl && <audio controls src={track.audioUrl} className='w-full' />} */}

              <input
                type='file'
                accept='audio/*'
                onChange={(e) => {
                  const updated = [...tracks];
                  // updated[index].file = e.target.files?.[0] || null;
                  setTracks(updated);
                }}
              />
            </div>
          ))}
        </div>

        <button disabled={saving} type='submit' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      <AlbumActions albumId={Number(album.id)} />
    </div>
  );
}
