'use client';

import { createContext, useContext, useState } from 'react';

interface Track {
  src: string;
  name: string;
}

interface PlayerContextType {
  playlist: Track[];
  currentIndex: number;
  track: Track | null;
  setPlaylistAndPlay: (tracks: Track[], startIndex: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const track = currentIndex >= 0 ? playlist[currentIndex] : null;

  const setPlaylistAndPlay = (tracks: Track[], startIndex: number) => {
    setPlaylist(tracks);
    setCurrentIndex(startIndex);
  };

  const playNext = () => {
    setCurrentIndex((prev) => {
      if (playlist.length === 0) return -1;
      return (prev + 1) % playlist.length;
    });
  };

  const playPrevious = () => {
    setCurrentIndex((prev) => {
      if (playlist.length === 0) return -1;
      return (prev - 1 + playlist.length) % playlist.length;
    });
  };

  const clearTrack = () => {
    setPlaylist([]);
    setCurrentIndex(-1);
  };

  return (
    <PlayerContext.Provider
      value={{ playlist, currentIndex, track, setPlaylistAndPlay, playNext, playPrevious, clearTrack }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
