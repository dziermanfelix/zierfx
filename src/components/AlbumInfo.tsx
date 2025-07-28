'use client';

import { formatDate, formatTime } from '@/utils/formatting';
import { AlbumWithTracks, makeTrackWithAlbumAndArtist, TrackWithAlbumAndArtist } from '@/types/music';
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
  const tracks: TrackWithAlbumAndArtist[] = album.tracks.map((track) =>
    makeTrackWithAlbumAndArtist(track, album, artist)
  );

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
    <div className='p-2 sm:p-4 flex flex-col max-w-7xl mx-auto rounded'>
      <div className={`${isMobile ? 'flex flex-col items-center space-y-2' : 'flex flex-row'}`}>
        <div className='relative group p-2'>
          <AlbumCoverWithPlay tracks={tracks} />
        </div>
        <div
          className={`${isMobile ? 'flex flex-col text-center space-y-1' : 'flex flex-col ml-4 p-2 justify-center'}`}
        >
          <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>{album.name}</h1>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-600`}>{artist.name}</h2>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-600`}>{formatDate(album.releaseDate)}</h2>
        </div>
      </div>

      <ul className={`list-none mt-4 ${isMobile ? 'space-y-2' : 'ml-4'} rounded p-2`}>
        {album.tracks.map((track, index) => (
          <li
            key={track.id}
            className='group flex border rounded p-3 mb-2 justify-between hover:border-blue-400 transition-colors'
            onDoubleClick={() => handlePlay(index)}
          >
            <div className='flex flex-row space-x-4 items-center'>
              <button
                className={`${
                  isMobile
                    ? 'text-blue-300'
                    : 'hidden group-hover:inline-block transition-opacity duration-200 hover:text-blue-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(index);
                }}
              >
                {currentIndex === index && isPlaying ? <Pause /> : <Play />}
              </button>
              <div className='block group-hover:hidden'>{track.number}</div>
              <div className={isMobile ? 'text-sm' : ''}>{track.name}</div>
            </div>

            <div className={`flex flex-row space-x-2 items-center ${isMobile ? 'justify-between' : ''}`}>
              <TrackDownloadButton track={track} />
              <div className='group-hover:hidden'>{track.length ? formatTime(track.length) : ''}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
