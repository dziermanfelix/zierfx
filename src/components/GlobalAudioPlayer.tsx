'use client';

import AudioPlayer from './AudioPlayer';
import { usePlayer } from '@/contexts/PlayerContext';
import { useIsMobile } from '@/utils/mobile';
import { X } from 'lucide-react';

export default function GlobalAudioPlayer() {
  const { track, playNext, playPrevious, clearTrack } = usePlayer();
  const isMobile = useIsMobile();

  if (!track) return null;
  if (!track.audioUrl) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 ${isMobile ? 'h-36' : 'h-24'} animate-slide-up`}
      style={{
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className='relative h-full'>
        <button
          onClick={clearTrack}
          className={`absolute ${
            isMobile ? 'top-2 right-2' : 'top-3 right-3'
          } p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 z-10 backdrop-blur-sm group active:scale-95`}
          aria-label='Close player'
        >
          <X className='w-4 h-4 transition-transform group-hover:scale-110' />
        </button>

        <AudioPlayer track={track} onEnded={playNext} onNext={playNext} onPrevious={playPrevious} />
      </div>
    </div>
  );
}
