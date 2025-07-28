'use client';

import AudioPlayer from './AudioPlayer';
import { usePlayer } from '@/contexts/PlayerContext';
import { useIsMobile } from '@/utils/mobile';

export default function GlobalAudioPlayer() {
  const { track, playNext, playPrevious, clearTrack } = usePlayer();
  const isMobile = useIsMobile();

  if (!track) return null;
  if (!track.audioUrl) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 shadow-md ${isMobile ? 'h-32' : 'h-25'}`}>
      <div className='relative h-full'>
        <button
          onClick={clearTrack}
          className={`absolute ${
            isMobile ? 'top-3 right-3' : 'top-2 right-2'
          } text-gray-500 hover:text-gray-400 text-md z-10`}
          aria-label='Close player'
        >
          X
        </button>

        <AudioPlayer track={track} onEnded={playNext} onNext={playNext} onPrevious={playPrevious} />
      </div>
    </div>
  );
}
