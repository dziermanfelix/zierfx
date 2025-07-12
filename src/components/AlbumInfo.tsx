import AlbumCover from '@/components/AlbumCover';
import { formatDate } from '@/utils/formatting';
import { AlbumSlim } from '@/types/music';

interface AlbumInfoProps {
  album: AlbumSlim;
  artistName: string;
}

export default function AlbumInfo({ album, artistName }: AlbumInfoProps) {
  return (
    <div className='p-4 flex flex-col max-w-7xl mx-auto rounded'>
      <div className='flex flex-row'>
        <div className='p-2 mb-3'>
          <AlbumCover src={album.artworkUrl} alt={`${album.name} artwork`} />
        </div>
        <div className='flex flex-col ml-4 p-2 justify-center'>
          <h1 className='text-2xl font-bold'>{album.name}</h1>
          <h2 className='text-xl text-gray-600'>{artistName}</h2>
          <h2 className='text-xl text-gray-600'>{formatDate(album.releaseDate)}</h2>
        </div>
      </div>

      <ul className='list-none mt-4 ml-4 rounded p-2'>
        {album.tracks.map((track) => (
          <li key={track.id} className='flex flex-row border rounded p-3 mb-2 justify-between'>
            <div className='flex flex-row space-x-2'>
              <div>{track.number}</div>
              <div>{track.name}</div>
            </div>
            <div className='flex flex-row space-x-2'>
              <button className='std-link rounded'>PLAY</button>
              <div>TIME</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
