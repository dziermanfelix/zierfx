'use client';

import { formatDate, formatTime } from '@/utils/formatting';
import { AlbumWithTracks, TrackWithAlbumAndArtist } from '@/types/music';
import { usePlayer } from '@/contexts/PlayerContext';
import { Play, Pause } from 'lucide-react';
import AlbumCoverWithPlay from './AlbumCoverWithPlay';
import { Artist } from '@prisma/client';
import TrackDownloadButton from './TrackDownloadButton';
import { useIsMobile } from '@/utils/mobile';

interface AlbumInfoProps {
  album: AlbumWithTracks;
  artist: Artist;
}

export default function AlbumInfo({ album, artist }: AlbumInfoProps) {
  const isMobile = useIsMobile();
  const { currentIndex, isPlaying, pause, resume, setPlaylistAndPlay } = usePlayer();
  const tracks: TrackWithAlbumAndArtist[] = album.tracks.map((track) => ({
    ...track,
    album: { ...album, artist },
    artist, // Flatten artist for easier access
  }));

  const handlePlay = (index: number) => {
    if (index === currentIndex) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      setPlaylistAndPlay(tracks, index);
    }
  };

  return (
    <div className='flex flex-col'>
      {/* Album Header Card */}
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-white/20'>
        <div className={`${isMobile ? 'flex flex-col items-center space-y-4' : 'flex flex-row items-center'}`}>
          <div className='relative group'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity'></div>
            <div className='relative'>
              <AlbumCoverWithPlay tracks={tracks} />
            </div>
          </div>
          <div
            className={`${
              isMobile ? 'flex flex-col text-center space-y-2' : 'flex flex-col ml-8 justify-center space-y-3'
            }`}
          >
            <h1
              className={`${
                isMobile ? 'text-2xl' : 'text-4xl sm:text-5xl'
              } font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}
            >
              {album.name}
            </h1>
            <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} text-gray-700 font-semibold`}>{artist.name}</h2>
            <h2 className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-500`}>{formatDate(album.releaseDate)}</h2>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20'>
        <h3 className='text-xl font-bold text-gray-800 mb-4 px-2'>Tracks</h3>
        <ul className='list-none space-y-2'>
          {album.tracks.map((track, index) => (
            <li
              key={track.id}
              className='group flex items-center justify-between bg-white/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl p-4 transition-all duration-200 hover:shadow-md border border-transparent hover:border-blue-200'
              onDoubleClick={() => handlePlay(index)}
            >
              <div className='flex flex-row space-x-4 items-center flex-1 min-w-0'>
                <button
                  className={`flex-shrink-0 ${
                    isMobile
                      ? 'text-blue-500 hover:text-purple-600'
                      : 'opacity-0 group-hover:opacity-100 transition-all duration-200 text-blue-500 hover:text-purple-600 hover:scale-110'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(index);
                  }}
                >
                  {currentIndex === index && isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div className='flex-shrink-0 w-6 text-center text-gray-500 font-medium group-hover:hidden'>
                  {track.number}
                </div>
                <div className={`truncate font-medium text-gray-800 ${isMobile ? 'text-sm' : ''}`}>{track.name}</div>
              </div>

              <div className='flex flex-row space-x-3 items-center ml-4'>
                <TrackDownloadButton track={track} />
                <div className='text-gray-500 font-medium text-sm group-hover:hidden min-w-[3rem] text-right'>
                  {track.length ? formatTime(track.length) : ''}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
