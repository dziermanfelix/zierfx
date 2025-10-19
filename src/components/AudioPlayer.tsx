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

  const formatTime = (seconds: number) => new Date(seconds * 1000).toISOString().substr(14, 5);

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
    audioRef.current.src = track.audioUrl;
    audioRef.current.load();
    setProgress(0);
    setIsReady(false);
  }, [track]);

  return (
    <div
      className={`w-full h-full bg-gray-900 ${
        isMobile
          ? 'p-3 flex flex-col justify-between'
          : 'p-2 flex flex-row justify-between items-center rounded text-center'
      }`}
    >
      <div
        className={`${
          isMobile
            ? 'flex items-center space-x-2 mb-3 bg-red-gray-800'
            : 'm-1 rounded w-3/8 flex flex-row space-x-5 justify-start items-center'
        }`}
      >
        <Link
          href={`/albums/${slugify(track.album.artist.name)}/${slugify(track.album.name)}`}
          className={`std-link ${isMobile ? 'flex-shrink-0' : ''}`}
        >
          <img
            className={`${isMobile ? 'w-12 h-12 rounded' : 'w-20 h-20'} bg-gray-800`}
            src={track.album.artworkUrl || undefined}
            alt=''
          />
        </Link>
        <div className={`${isMobile ? 'flex-1 min-w-0 ml-2' : 'flex flex-col items-start text-left'}`}>
          <p className={`${isMobile ? 'text-sm truncate leading-tight' : 'text-lg'}`} title={track.name}>
            {track.name}
          </p>
          <p
            className={`${isMobile ? 'text-sm truncate leading-tight' : 'text-md text-gray-300'}`}
            title={track.album.artist.name}
          >
            {track.album.artist.name}
          </p>
          <p
            className={`${isMobile ? 'text-sm truncate leading-tight' : 'text-md text-gray-300'}`}
            title={track.album.name}
          >
            {track.album.name}
          </p>
        </div>
      </div>

      <div
        className={`flex ${
          isMobile ? 'justify-center space-x-4 mb-3' : 'flex-col flex-1 space-y-2 items-center m-1 rounded'
        }`}
      >
        <div className={`flex ${isMobile ? '' : 'flex-row space-x-3 justify-center w-full'}`}>
          <button
            onClick={onPrevious}
            className={`${
              isMobile
                ? 'p-2 rounded-full hover:bg-gray-800 text-gray-300 hover:text-white'
                : 'px-2 py-1 text-sm rounded-full hover:text-white'
            }`}
          >
            <SkipBack className='w-5 h-5' />
          </button>
          <button onClick={togglePlay} className='p-3 rounded-full bg-white hover:bg-gray-200 text-black'>
            {isPlaying ? <Pause className='w-6 h-6' /> : <Play className='w-6 h-6' />}
          </button>
          <button
            onClick={onNext}
            className={`${
              isMobile
                ? 'p-2 rounded-full hover:bg-gray-800 text-gray-300 hover:text-white'
                : 'px-2 py-1 text-sm rounded-full hover:text-white'
            }`}
          >
            <SkipForward className='w-5 h-5' />
          </button>
        </div>

        {!isMobile && (
          <div className='flex items-center flex-row space-x-1 w-full'>
            <span className={'text-sm'}>{formatTime(progress)}</span>
            <input
              className={'w-full'}
              type='range'
              min='0'
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
            />
            <span className='text-sm'>{formatTime(duration)}</span>
          </div>
        )}
      </div>

      {!isMobile && <div className='m-1 rounded w-3/8'></div>}

      <audio ref={audioRef} preload='metadata' />
    </div>
  );
}
