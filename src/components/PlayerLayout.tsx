'use client';

import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';
import GlobalAudioPlayer from '@/components/GlobalAudioPlayer';
import Navigation from '@/components/Navigation';
import { useIsMobile } from '@/utils/mobile';

function PlayerContent({ children }: { children: React.ReactNode }) {
  const { currentIndex } = usePlayer();
  const isMobile = useIsMobile();

  return (
    <>
      <Navigation />
      <div className={currentIndex !== -1 ? (isMobile ? 'pb-32' : 'pb-24') : ''}>
        {children}
        <GlobalAudioPlayer />
      </div>
    </>
  );
}

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <PlayerContent>{children}</PlayerContent>
    </PlayerProvider>
  );
}
