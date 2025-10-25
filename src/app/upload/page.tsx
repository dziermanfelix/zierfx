'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/utils/routes';
import EnhancedFileInput from '@/components/EnhancedFileInput';
import TrackItem, { TrackItemData } from '@/components/TrackItem';
import UploadProgressSection from '@/components/UploadProgressSection';
import FormSection from '@/components/FormSection';
import FormInput from '@/components/FormInput';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useUploadProgress } from '@/hooks/useUploadProgress';
import { ToastProvider, useToast } from '@/components/ToastContainer';

interface UploadFormData {
  artist: string;
  album: string;
  releaseDate: string;
  tracks: TrackItemData[];
}

function UploadPageContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [artwork, setArtwork] = useState<File | null>(null);
  const [tracks, setTracks] = useState<TrackItemData[]>([{ name: '', file: null }]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { fileProgresses, overallProgress, initializeFiles, updateFileProgress, reset } = useUploadProgress();
  const [draftData, saveDraft, clearDraft] = useLocalStorage<UploadFormData | null>('upload-draft', null);

  // Load draft on mount
  useEffect(() => {
    if (draftData) {
      setArtist(draftData.artist);
      setAlbum(draftData.album);
      setReleaseDate(draftData.releaseDate);
      setTracks(draftData.tracks.length > 0 ? draftData.tracks : [{ name: '', file: null }]);
      showToast('Draft loaded', 'info');
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (artist || album || releaseDate || tracks.some((t) => t.name)) {
      setHasUnsavedChanges(true);
      const timer = setTimeout(() => {
        saveDraft({ artist, album, releaseDate, tracks });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [artist, album, releaseDate, tracks]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !uploading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, uploading]);

  const handleLogout = async () => {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to logout?')) {
      return;
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(routes.HOME);
  };

  const validateForm = (): string | null => {
    if (!artist.trim()) return 'Artist name is required';
    if (!album.trim()) return 'Album name is required';
    if (!releaseDate) return 'Release date is required';
    if (!artwork) return 'Album artwork is required';
    if (tracks.length === 0) return 'At least one track is required';

    for (let i = 0; i < tracks.length; i++) {
      if (!tracks[i].name.trim()) return `Track ${i + 1} name is required`;
      if (!tracks[i].file) return `Track ${i + 1} file is required`;
    }

    return null;
  };

  const simulateUploadProgress = async (fileName: string, file: File): Promise<void> => {
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
      }, 200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    setUploading(true);
    reset();

    try {
      // Initialize progress tracking
      const fileNames = [artwork!.name, ...tracks.map((t, i) => t.file?.name || `Track ${i + 1}`)];
      initializeFiles(fileNames);

      const formData = new FormData();
      formData.append('artist', artist);
      formData.append('album', album);
      formData.append('releaseDate', releaseDate);

      if (artwork) {
        formData.append('artwork', artwork);
        await simulateUploadProgress(artwork.name, artwork);
      }

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        formData.append(`tracks[${i}][name]`, track.name);
        if (track.file) {
          formData.append(`tracks[${i}][file]`, track.file);
          await simulateUploadProgress(track.file.name, track.file);
        }
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        showToast('Album uploaded successfully!', 'success');
        clearDraft();
        setHasUnsavedChanges(false);
        setTimeout(() => {
          router.replace(routes.HOME);
        }, 1500);
      } else {
        const error = await res.json();
        showToast(error.message || 'Upload failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('An error occurred during upload. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const addTrack = () => {
    setTracks([...tracks, { name: '', file: null }]);
  };

  const updateTrack = (index: number, track: TrackItemData) => {
    const updated = [...tracks];
    updated[index] = track;
    setTracks(updated);
  };

  const deleteTrack = (index: number) => {
    if (tracks.length === 1) {
      showToast('Cannot delete the last track', 'warning');
      return;
    }
    const updated = [...tracks];
    updated.splice(index, 1);
    setTracks(updated);
    showToast('Track deleted', 'info');
  };

  const moveTrackUp = (index: number) => {
    if (index === 0) return;
    const updated = [...tracks];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTracks(updated);
  };

  const moveTrackDown = (index: number) => {
    if (index === tracks.length - 1) return;
    const updated = [...tracks];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setTracks(updated);
  };

  const clearForm = () => {
    if (!confirm('Are you sure you want to clear the form? This cannot be undone.')) {
      return;
    }
    setArtist('');
    setAlbum('');
    setReleaseDate('');
    setArtwork(null);
    setTracks([{ name: '', file: null }]);
    clearDraft();
    setHasUnsavedChanges(false);
    showToast('Form cleared', 'info');
  };

  return (
    <main className='p-8 min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <FormSection>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>New Release</h1>
              <p className='text-sm text-gray-500 mt-1'>Upload new music</p>
            </div>
            <div className='flex space-x-3'>
              <a href='/admin' className='text-sm text-blue-600 hover:text-blue-800 underline'>
                Admin Dashboard
              </a>
              {hasUnsavedChanges && !uploading && (
                <button onClick={clearForm} className='text-sm text-gray-600 hover:text-gray-800 underline'>
                  Clear Draft
                </button>
              )}
              <button onClick={handleLogout} className='text-sm text-gray-600 hover:text-gray-800 underline'>
                Logout
              </button>
            </div>
          </div>
        </FormSection>

        {/* Upload Progress */}
        {uploading && (
          <UploadProgressSection
            fileProgresses={fileProgresses}
            overallProgress={overallProgress}
            title='Upload Progress'
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Album Info */}
          <FormSection title='Album Information'>
            <div className='space-y-4'>
              <FormInput
                label='Artist Name *'
                type='text'
                value={artist}
                onChange={setArtist}
                placeholder='Enter artist name'
                required
                disabled={uploading}
              />

              <FormInput
                label='Album Name *'
                type='text'
                value={album}
                onChange={setAlbum}
                placeholder='Enter album name'
                required
                disabled={uploading}
              />

              <FormInput
                label='Release Date *'
                type='date'
                value={releaseDate}
                onChange={setReleaseDate}
                required
                disabled={uploading}
              />
            </div>
          </FormSection>

          {/* Artwork */}
          <FormSection title='Album Artwork *'>
            <EnhancedFileInput
              accept='image/*'
              label='Upload Album Artwork'
              type='image'
              showPreview={true}
              onChange={(file) => setArtwork(file)}
              required
            />
          </FormSection>

          {/* Tracks */}
          <FormSection title={`Tracks (${tracks.length})`}>
            <div className='flex justify-end mb-4'>
              <button
                type='button'
                onClick={addTrack}
                disabled={uploading}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
              >
                + Add Track
              </button>
            </div>

            <div className='space-y-3'>
              {tracks.map((track, index) => (
                <TrackItem
                  key={index}
                  track={track}
                  index={index}
                  onUpdate={updateTrack}
                  onDelete={deleteTrack}
                  onMoveUp={moveTrackUp}
                  onMoveDown={moveTrackDown}
                  canMoveUp={index > 0}
                  canMoveDown={index < tracks.length - 1}
                  disabled={uploading}
                  mode='create'
                />
              ))}
            </div>
          </FormSection>

          {/* Submit */}
          <FormSection>
            <button
              disabled={uploading}
              type='submit'
              className='w-full py-3 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {uploading ? 'Uploading...' : 'Upload Album'}
            </button>
            {hasUnsavedChanges && !uploading && (
              <p className='text-xs text-gray-500 mt-2 text-center'>Draft auto-saved</p>
            )}
          </FormSection>
        </form>
      </div>
    </main>
  );
}

export default function UploadPage() {
  return (
    <ToastProvider>
      <UploadPageContent />
    </ToastProvider>
  );
}
