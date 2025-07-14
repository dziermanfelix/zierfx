'use client';

import { createContext, useContext, useState } from 'react';

interface Track {
  src: string | null;
  name: string;
}

interface PlayerContextType {
  playlist: Track[];
  currentIndex: number;
  track: Track | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  pause: () => void;
  resume: () => void;
  setPlaylistAndPlay: (tracks: Track[], startIndex: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // ✅ new

  const track = currentIndex >= 0 ? playlist[currentIndex] : null;

  const setPlaylistAndPlay = (tracks: Track[], startIndex: number) => {
    setPlaylist(tracks);
    setCurrentIndex(startIndex);
    setIsPlaying(true);
  };

  const playNext = () => {
    setCurrentIndex((prev) => {
      if (playlist.length === 0) return -1;
      return (prev + 1) % playlist.length;
    });
    setIsPlaying(true);
  };

  const playPrevious = () => {
    setCurrentIndex((prev) => {
      if (playlist.length === 0) return -1;
      return (prev - 1 + playlist.length) % playlist.length;
    });
    setIsPlaying(true);
  };

  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);

  const clearTrack = () => {
    setPlaylist([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        playlist,
        currentIndex,
        track,
        isPlaying,
        setIsPlaying,
        pause,
        resume,
        setPlaylistAndPlay,
        playNext,
        playPrevious,
        clearTrack,
      }}
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
