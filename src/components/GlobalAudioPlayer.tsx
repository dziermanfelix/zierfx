'use client';

import AudioPlayer from './AudioPlayer';
import { usePlayer } from '@/contexts/PlayerContext';

export default function GlobalAudioPlayer() {
  const { track, playNext, playPrevious, clearTrack } = usePlayer();

  if (!track) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md'>
      <AudioPlayer
        src={track.src}
        trackName={track.name}
        onEnded={playNext}
        onNext={playNext}
        onPrevious={playPrevious}
      />
    </div>
  );
}
