'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import AlbumActions from './AlbumActions';
import { slugify } from '@/utils/slugify';
import { Artist, Track } from '@prisma/client';
import EnhancedFileInput from './EnhancedFileInput';
import TrackItem, { TrackItemData } from './TrackItem';
import UploadProgressSection from './UploadProgressSection';
import FormSection from './FormSection';
import FormInput from './FormInput';
import { AlbumWithTracks } from '@/types/music';
import { useToast } from './ToastContainer';
import { useUploadProgress } from '@/hooks/useUploadProgress';

type AlbumInfoProps = {
  album: AlbumWithTracks;
  artist: Artist;
  onSaveSuccess: (updatedAlbum: AlbumWithTracks) => void;
};

type EditableTrack = TrackItemData & {
  id: number | bigint;
  number: number;
  audioUrl: string | null;
  downloadable: boolean;
};

export default function EditAlbumForm({ album, artist, onSaveSuccess }: AlbumInfoProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [albumName, setAlbumName] = useState(album.name);
  const [releaseDate, setReleaseDate] = useState(album.releaseDate.toString().slice(0, 10));
  const [adminOnly, setAdminOnly] = useState(album.adminOnly);
  const [artwork, setArtwork] = useState<File | null>(null);
  const [tracks, setTracks] = useState<EditableTrack[]>(
    album.tracks.map((track) => ({
      id: track.id,
      name: track.name,
      number: track.number,
      audioUrl: track.audioUrl,
      file: null,
      downloadable: track.downloadable,
    }))
  );

  const { fileProgresses, overallProgress, initializeFiles, updateFileProgress, reset } = useUploadProgress();

  const validateForm = (): string | null => {
    if (!albumName.trim()) return 'Album name is required';
    if (!releaseDate) return 'Release date is required';

    for (let i = 0; i < tracks.length; i++) {
      if (!tracks[i].name.trim()) return `Track ${i + 1} name is required`;
    }

    return null;
  };

  const simulateUploadProgress = async (fileName: string): Promise<void> => {
    return new Promise((resolve) => {
      updateFileProgress(fileName, 0, 'uploading');
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          updateFileProgress(fileName, 100, 'complete');
          clearInterval(interval);
          resolve();
        } else {
          updateFileProgress(fileName, progress, 'uploading');
        }
      }, 150);
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    setSaving(true);
    reset();

    try {
      // Initialize progress tracking for files being uploaded
      const filesToUpload: string[] = [];
      if (artwork) filesToUpload.push(artwork.name);
      tracks.forEach((track) => {
        if (track.file) filesToUpload.push(track.file.name);
      });

      if (filesToUpload.length > 0) {
        initializeFiles(filesToUpload);
      }

      const formData = new FormData();
      formData.append('artistName', artist.name);
      formData.append('albumName', albumName);
      formData.append('releaseDate', String(releaseDate));
      formData.append('adminOnly', String(adminOnly));

      if (artwork) {
        formData.append('artwork', artwork);
        await simulateUploadProgress(artwork.name);
      }

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        formData.append(`tracks[${i}][id]`, track.id.toString());
        formData.append(`tracks[${i}][name]`, track.name);
        formData.append(`tracks[${i}][number]`, track.number.toString());
        formData.append(`tracks[${i}][downloadable]`, String(track.downloadable));
        if (track.file) {
          formData.append(`tracks[${i}][file]`, track.file);
          await simulateUploadProgress(track.file.name);
        }
      }

      const res = await fetch(`/api/album/${album.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        onSaveSuccess(updated.album);
        showToast('Album updated successfully!', 'success');
        router.replace(`/albums/${slugify(artist.name)}/${slugify(updated.album.name)}/edit`);
      } else {
        const error = await res.json();
        showToast(error.message || 'Update failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      showToast('An error occurred during update. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateTrack = (index: number, track: TrackItemData) => {
    const updated = [...tracks];
    updated[index] = { ...updated[index], ...track };
    setTracks(updated);
  };

  const moveTrackUp = (index: number) => {
    if (index === 0) return;
    const updated = [...tracks];
    const temp = updated[index - 1].number;
    updated[index - 1].number = updated[index].number;
    updated[index].number = temp;
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTracks(updated);
    showToast('Track moved up', 'info');
  };

  const moveTrackDown = (index: number) => {
    if (index === tracks.length - 1) return;
    const updated = [...tracks];
    const temp = updated[index + 1].number;
    updated[index + 1].number = updated[index].number;
    updated[index].number = temp;
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setTracks(updated);
    showToast('Track moved down', 'info');
  };

  return (
    <div className='space-y-6'>
      {/* Upload Progress */}
      {saving && (
        <UploadProgressSection
          fileProgresses={fileProgresses}
          overallProgress={overallProgress}
          title='Update Progress'
        />
      )}

      {/* Form */}
      <FormSection>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Edit Album</h2>
            <p className='text-sm text-gray-500'>Make changes to {album.name}</p>
          </div>

          {/* Album Info */}
          <div className='space-y-4'>
            <FormInput
              label='Album Name *'
              type='text'
              value={albumName}
              onChange={setAlbumName}
              required
              disabled={saving}
            />

            <FormInput
              label='Release Date *'
              type='date'
              value={String(releaseDate)}
              onChange={setReleaseDate}
              required
              disabled={saving}
            />

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='adminOnly'
                checked={adminOnly}
                onChange={(e) => setAdminOnly(e.target.checked)}
                disabled={saving}
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label htmlFor='adminOnly' className='text-sm font-medium text-gray-700'>
                Admin Only (only visible to logged-in administrators)
              </label>
            </div>
          </div>

          {/* Artwork */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Album Artwork {artwork ? '(New)' : '(Optional)'}
            </label>
            <EnhancedFileInput
              accept='image/*'
              label='Upload New Artwork'
              type='image'
              showPreview={true}
              value={artwork}
              onChange={(file) => setArtwork(file)}
            />
            {album.artworkUrl && !artwork && (
              <p className='text-xs text-gray-500 mt-2'>Current artwork will be kept if no new file is uploaded</p>
            )}
          </div>

          {/* Tracks */}
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>Tracks ({tracks.length})</h3>
            <div className='space-y-3'>
              {tracks.map((track, index) => (
                <TrackItem
                  key={track.id.toString()}
                  track={track}
                  index={index}
                  onUpdate={updateTrack}
                  onMoveUp={moveTrackUp}
                  onMoveDown={moveTrackDown}
                  canMoveUp={index > 0}
                  canMoveDown={index < tracks.length - 1}
                  canDelete={false}
                  disabled={saving}
                  mode='edit'
                  showCollapse={false}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={saving}
            type='submit'
            className='w-full py-3 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </FormSection>

      {/* Album Actions */}
      <FormSection title='Danger Zone'>
        <AlbumActions albumId={Number(album.id)} />
      </FormSection>
    </div>
  );
}
