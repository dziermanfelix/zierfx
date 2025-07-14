'use client';

import AudioPlayer from './AudioPlayer';
import { usePlayer } from '@/contexts/PlayerContext';

export default function GlobalAudioPlayer() {
  const { track, playNext, playPrevious, clearTrack } = usePlayer();

  if (!track) return null;
  if (!track.audioUrl) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 shadow-md h-25'>
      <div className='relative'>
        <button
          onClick={clearTrack}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-400 text-md'
          aria-label='Close player'
        >
          X
        </button>

        <AudioPlayer track={track} onEnded={playNext} onNext={playNext} onPrevious={playPrevious} />
      </div>
    </div>
  );
}
