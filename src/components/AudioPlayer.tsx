'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  src: string;
  trackName: string;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function AudioPlayer({ src, trackName, onEnded, onNext, onPrevious }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
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
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setPlaying(false);
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
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.load();
      audioRef.current.play();
      setPlaying(true);
    }
  }, [src]);

  return (
    <div className='w-full mt-4 p-4 border rounded'>
      <p className='text-lg font-medium mb-2'>{trackName}</p>
      <div className='flex items-center space-x-3'>
        <button onClick={onPrevious} className='px-3 py-1 rounded text-sm'>
          ⏮ Prev
        </button>
        <button onClick={togglePlay} className='text-white px-3 py-1 rounded text-sm'>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button onClick={onNext} className='px-3 py-1 rounded text-sm'>
          Next ⏭
        </button>
        <input type='range' min='0' max={duration || 0} value={progress} onChange={handleSeek} className='w-full' />
        <span className='text-sm whitespace-nowrap'>
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
      <audio ref={audioRef} />
    </div>
  );
}
