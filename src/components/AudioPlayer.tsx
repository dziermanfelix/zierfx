'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  src: string;
  trackName: string;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function AudioPlayer({ src, trackName, onEnded, onNext, onPrevious }: AudioPlayerProps) {
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
    if (!audioRef.current) return;
    audioRef.current.src = src;
    audioRef.current.load();
    setProgress(0);
    setIsReady(false);
  }, [src]);

  return (
    <div className='w-full p-2 border rounded'>
      <p className='text-lg font-medium mb-2'>{trackName}</p>
      <div className='flex items-center space-x-3'>
        <button onClick={onPrevious} className='px-3 py-1 rounded text-sm'>
          ⏮ Prev
        </button>
        <button onClick={togglePlay} className='text-white px-3 py-1 rounded text-sm'>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={onNext} className='px-3 py-1 rounded text-sm'>
          Next ⏭
        </button>
        <input type='range' min='0' max={duration || 0} value={progress} onChange={handleSeek} className='w-full' />
        <span className='text-sm whitespace-nowrap'>
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
      <audio ref={audioRef} preload='metadata' />
    </div>
  );
}
