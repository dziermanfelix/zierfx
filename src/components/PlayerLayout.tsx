'use client';

import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';
import GlobalAudioPlayer from '@/components/GlobalAudioPlayer';

function PlayerContent({ children }: { children: React.ReactNode }) {
  const { currentIndex } = usePlayer();

  return (
    <div className={currentIndex !== -1 ? 'pb-24' : ''}>
      {children}
      <GlobalAudioPlayer />
    </div>
  );
}

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <PlayerContent>{children}</PlayerContent>
    </PlayerProvider>
  );
}
