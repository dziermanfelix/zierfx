'use client';

import { formatDate, formatTime } from '@/utils/formatting';
import { AlbumWithTracks, makeTrackWithAlbumAndArtist, TrackWithAlbumAndArtist } from '@/types/music';
import { usePlayer } from '@/contexts/PlayerContext';
import { Play, Pause, Download } from 'lucide-react';
import AlbumCoverWithPlay from './AlbumCoverWithPlay';
import { Artist } from '@prisma/client';

interface AlbumInfoProps {
  album: AlbumWithTracks;
  artist: Artist;
}

export default function AlbumInfo({ album, artist }: AlbumInfoProps) {
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
    <div className='p-4 flex flex-col max-w-7xl mx-auto rounded'>
      <div className='flex flex-row'>
        <div className='relative group p-2'>
          <AlbumCoverWithPlay tracks={tracks} />
        </div>
        <div className='flex flex-col ml-4 p-2 justify-center'>
          <h1 className='text-2xl font-bold'>{album.name}</h1>
          <h2 className='text-xl text-gray-600'>{artist.name}</h2>
          <h2 className='text-xl text-gray-600'>{formatDate(album.releaseDate)}</h2>
        </div>
      </div>

      <ul className='list-none mt-4 ml-4 rounded p-2'>
        {album.tracks.map((track, index) => (
          <li
            key={track.id}
            className='group flex flex-row border rounded p-3 mb-2 justify-between hover:border-blue-400'
            onDoubleClick={() => handlePlay(index)}
          >
            <div className='flex flex-row space-x-2 items-center'>
              <div className='block group-hover:hidden'>{track.number}</div>
              <button
                className='hidden group-hover:inline-block transition-opacity duration-200 hover:text-blue-300'
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(index);
                }}
              >
                {currentIndex === index && isPlaying ? <Pause /> : <Play />}
              </button>
              <div>{track.name}</div>
            </div>

            <div className='flex flex-row space-x-2 items-center'>
              <a
                href={track.audioUrl || '#'}
                download
                className='hidden group-hover:inline-flex items-center text-sm rounded hover:text-blue-300 transition'
                onClick={(e) => {
                  if (!track.audioUrl) e.preventDefault();
                }}
              >
                <Download />
              </a>
              <div className='group-hover:hidden'>{track.length ? formatTime(track.length) : ''}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
