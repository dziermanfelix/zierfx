'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';
import { TrackWithAlbumAndArtist } from '@/types/music';
import { useIsMobile } from '@/utils/mobile';

interface AudioPlayerProps {
  track: TrackWithAlbumAndArtist;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function AudioPlayer({ track, onEnded, onNext, onPrevious }: AudioPlayerProps) {
  const isMobile = useIsMobile();
  const { isPlaying, setIsPlaying } = usePlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsReady(true);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (onEnded) onEnded();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    if (!audioRef.current || !isReady) return;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (!audioRef.current || !track.audioUrl) return;
    // Use the streaming API endpoint to proxy Supabase requests with signed URLs
    const streamUrl = `/api/stream?url=${encodeURIComponent(track.audioUrl)}`;
    audioRef.current.src = streamUrl;
    audioRef.current.load();
    setProgress(0);
    setIsReady(false);
  }, [track]);

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  if (isMobile) {
    return (
      <div className='w-full h-full backdrop-blur-xl bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95 px-4 py-4 flex flex-col justify-center border-t border-gray-700/50 shadow-2xl'>
        {/* Track Info */}
        <div className='flex items-center space-x-3 mb-2'>
          <Link
            href={`/albums/${slugify(track.album.artist.name)}/${slugify(track.album.name)}`}
            className='group flex-shrink-0 relative overflow-hidden rounded-lg shadow-lg'
          >
            <img
              className='w-12 h-12 object-cover transition-transform duration-300 group-active:scale-95'
              src={track.album.artworkUrl || undefined}
              alt={track.album.name}
            />
            <div className='absolute inset-0 bg-black/0 group-active:bg-black/20 transition-colors duration-300' />
          </Link>
          <div className='flex-1 min-w-0'>
            <Link href={`/albums/${slugify(track.album.artist.name)}/${slugify(track.album.name)}`} className='block'>
              <p className='text-sm font-bold text-white truncate leading-tight mb-0.5' title={track.name}>
                {track.name}
              </p>
            </Link>
            <p
              className='text-xs text-gray-400 truncate leading-tight'
              title={`${track.album.artist.name} • ${track.album.name}`}
            >
              {track.album.artist.name} • {track.album.name}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='mb-2 px-4'>
          <div className='relative h-1 bg-gray-700 rounded-full overflow-hidden'>
            <div
              className='absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-100'
              style={{ width: `${progressPercentage}%` }}
            />
            <input
              type='range'
              min='0'
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className='absolute inset-0 w-full h-full opacity-0'
              aria-label='Seek'
            />
          </div>
          <div className='flex justify-between items-center mt-0.5'>
            <span className='text-xs text-gray-400 tabular-nums'>{formatTime(progress)}</span>
            <span className='text-xs text-gray-400 tabular-nums'>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className='flex items-center justify-center space-x-4'>
          <button
            onClick={onPrevious}
            className='p-2 rounded-full active:bg-white/10 text-gray-300 active:text-white transition-all duration-150 active:scale-95'
            aria-label='Previous track'
          >
            <SkipBack className='w-5 h-5' />
          </button>
          <button
            onClick={togglePlay}
            className='p-3 rounded-full bg-white active:bg-blue-400 text-black shadow-lg active:shadow-blue-500/50 transition-all duration-150 active:scale-95'
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className='w-6 h-6' /> : <Play className='w-6 h-6 ml-0.5' />}
          </button>
          <button
            onClick={onNext}
            className='p-2 rounded-full active:bg-white/10 text-gray-300 active:text-white transition-all duration-150 active:scale-95'
            aria-label='Next track'
          >
            <SkipForward className='w-5 h-5' />
          </button>
        </div>

        <audio ref={audioRef} preload='metadata' />
      </div>
    );
  }

  return (
    <div className='w-full h-full backdrop-blur-xl bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 px-6 py-4 flex flex-row justify-between items-center border-t border-gray-700/50 shadow-2xl'>
      {/* Track Info Section */}
      <div className='flex-shrink-0 w-1/3 flex flex-row space-x-4 items-center'>
        <Link
          href={`/albums/${slugify(track.album.artist.name)}/${slugify(track.album.name)}`}
          className='group flex-shrink-0 relative overflow-hidden rounded-lg shadow-lg'
        >
          <img
            className='w-16 h-16 object-cover transition-transform duration-300 group-hover:scale-110'
            src={track.album.artworkUrl || undefined}
            alt={track.album.name}
          />
          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300' />
        </Link>
        <div className='flex-1 min-w-0 pr-4'>
          <Link
            href={`/albums/${slugify(track.album.artist.name)}/${slugify(track.album.name)}`}
            className='block group'
          >
            <p
              className='text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors duration-200'
              title={track.name}
            >
              {track.name}
            </p>
          </Link>
          <p
            className='text-sm text-gray-400 truncate hover:text-gray-300 transition-colors duration-200 cursor-default'
            title={`${track.album.artist.name} • ${track.album.name}`}
          >
            {track.album.artist.name} • {track.album.name}
          </p>
        </div>
      </div>

      {/* Controls and Progress Section */}
      <div className='flex-1 mx-8 flex flex-col justify-center space-y-2'>
        {/* Controls */}
        <div className='flex items-center justify-center space-x-4'>
          <button
            onClick={onPrevious}
            className='group p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 active:scale-95'
            aria-label='Previous track'
          >
            <SkipBack className='w-5 h-5 transition-transform group-hover:scale-110' />
          </button>
          <button
            onClick={togglePlay}
            className='group p-3 rounded-full bg-white hover:bg-blue-400 text-black shadow-lg hover:shadow-blue-500/50 transition-all duration-200 active:scale-95'
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className='w-6 h-6 transition-transform group-hover:scale-110' />
            ) : (
              <Play className='w-6 h-6 ml-0.5 transition-transform group-hover:scale-110' />
            )}
          </button>
          <button
            onClick={onNext}
            className='group p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 active:scale-95'
            aria-label='Next track'
          >
            <SkipForward className='w-5 h-5 transition-transform group-hover:scale-110' />
          </button>
        </div>

        {/* Progress Bar */}
        <div className='flex items-center space-x-3 w-full group'>
          <span className='text-xs text-gray-400 tabular-nums min-w-[40px] text-right'>{formatTime(progress)}</span>
          <div className='relative flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden cursor-pointer group-hover:h-2 transition-all duration-200'>
            <div
              className='absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-100'
              style={{ width: `${progressPercentage}%` }}
            />
            <input
              type='range'
              min='0'
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              aria-label='Seek'
            />
          </div>
          <span className='text-xs text-gray-400 tabular-nums min-w-[40px]'>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Empty space for balance */}
      <div className='flex-shrink-0 w-1/3' />

      <audio ref={audioRef} preload='metadata' />
    </div>
  );
}
