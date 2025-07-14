'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { AlbumUi, TrackUi } from '@/types/music';
import AlbumActions from './AlbumActions';
import { slugify } from '@/utils/slugify';

type AlbumInfoProps = {
  album: AlbumUi;
  artistName: string;
  onSaveSuccess: (updatedAlbum: AlbumUi) => void;
};

type EditableTrack = TrackUi & {
  file?: File | null;
};

export default function EditAlbumForm({ album, artistName, onSaveSuccess }: AlbumInfoProps) {
  const router = useRouter();
  const [albumName, setAlbumName] = useState(album.name);
  const [releaseDate, setReleaseDate] = useState(album.releaseDate.toString().slice(0, 10));
  const [artwork, setArtwork] = useState<File | null>(null);
  const [tracks, setTracks] = useState<EditableTrack[]>(
    album.tracks.map((track) => ({
      ...track,
      file: null,
    }))
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('artistName', artistName);
    formData.append('albumName', albumName);
    formData.append('releaseDate', String(releaseDate));
    if (artwork) formData.append('artwork', artwork);

    tracks.forEach((track, index) => {
      formData.append(`tracks[${index}][id]`, track.id.toString());
      formData.append(`tracks[${index}][name]`, track.name);
      formData.append(`tracks[${index}][number]`, track.number);
      if (track.file) {
        formData.append(`tracks[${index}][file]`, track.file);
      }
    });

    const res = await fetch(`/api/album/${album.id}`, {
      method: 'PATCH',
      body: formData,
    });

    if (res.ok) {
      const updated = await res.json();
      onSaveSuccess(updated.album);
      router.replace(`/albums/${slugify(artistName)}/${slugify(updated.album.name)}/edit`);
    } else {
      alert('Update failed.');
    }
    setSaving(false);
  };

  return (
    <div className='p-4 flex flex-col max-w-3xl mx-auto rounded'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h2 className='text-xl font-semibold'>Editing Album: {album.name}</h2>

        <input
          type='text'
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          className='border p-2 w-full rounded'
        />

        <input
          type='date'
          value={String(releaseDate)}
          onChange={(e) => setReleaseDate(e.target.value)}
          className='border p-2 w-full rounded'
        />

        <div>
          <label className='block mb-1 font-medium'>Artwork:</label>
          <input
            className='p-1 w-1/4 border rounded'
            type='file'
            accept='image/*'
            onChange={(e) => setArtwork(e.target.files?.[0] || null)}
          />
        </div>

        <div className='space-y-1'>
          <p className='font-medium'>Tracks:</p>
          {tracks.map((track, index) => (
            <div key={track.id} className='p-1 w-full space-y-1'>
              <div className='flex flex-row p-1 justify-center items-baseline'>
                <label className='mr-2'>{track.number}.</label>

                <div className='flex flex-col w-full'>
                  <input
                    className='border mb-1 p-2 rounded w-full'
                    type='text'
                    value={track.name}
                    onChange={(e) => {
                      const updated = [...tracks];
                      updated[index].name = e.target.value;
                      setTracks(updated);
                    }}
                  />

                  <input
                    className='border p-1 text-sm rounded w-1/8'
                    type='file'
                    accept='audio/*'
                    onChange={(e) => {
                      const updated = [...tracks];
                      updated[index].file = e.target.files?.[0] || null;
                      setTracks(updated);
                    }}
                  />
                </div>
              </div>
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
