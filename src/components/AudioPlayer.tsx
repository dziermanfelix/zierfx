'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';
import { TrackWithAlbumAndArtist } from '@/types/music';

interface AudioPlayerProps {
  track: TrackWithAlbumAndArtist;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function AudioPlayer({ track, onEnded, onNext, onPrevious }: AudioPlayerProps) {
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
    <div className='w-full h-full p-2 text-center items-center flex flex-row rounded justify-between bg-gray-900'>
      <div className='m-1 rounded w-3/8 flex flex-row space-x-5 justify-start items-center'>
        <Link href={`/albums/${slugify(track.artist.name)}/${slugify(track.album.name)}`} className='std-link'>
          <img
            className='w-20 h-20 bg-gray-800'
            src={track.album.artworkUrl ? track.album.artworkUrl : undefined}
            alt=''
          ></img>
        </Link>
        <div className='flex flex-col items-start align-left text-left'>
          <p className='text-lg'>{track.name}</p>
          <p className='text-md text-gray-300'>{track.artist.name}</p>
          <p className='text-sm text-gray-300'>{track.album.name}</p>
        </div>
      </div>

      <div className='flex flex-col flex-1 space-y-2 items-center m-1 rounded'>
        <div className='flex flex-row space-x-3 justify-center w-full'>
          <button onClick={onPrevious} className='px-2 py-1 text-sm rounded-full hover:text-blue-400'>
            <SkipBack />
          </button>
          <button onClick={togglePlay} className='px-2 py-1 text-sm rounded-full hover:text-blue-300'>
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button onClick={onNext} className='px-2 py-1 text-sm rounded-full hover:text-blue-400'>
            <SkipForward />
          </button>
        </div>

        <div className='flex flex-row space-x-1 w-full'>
          <span className='text-sm'>{formatTime(progress)}</span>
          <input className='w-full' type='range' min='0' max={duration || 0} value={progress} onChange={handleSeek} />
          <span className='text-sm'>{formatTime(duration)}</span>
        </div>
      </div>

      <div className='m-1 rounded w-3/8'></div>

      <audio ref={audioRef} preload='metadata' />
    </div>
  );
}
