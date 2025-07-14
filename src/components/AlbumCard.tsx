import { AlbumWithTracks, ArtistWithAlbumAndTracks } from '@/types/music';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';
import { formatDate } from '@/utils/formatting';

interface AlbumCardProps {
  artist: ArtistWithAlbumAndTracks;
  album: AlbumWithTracks;
  search: string;
  filterBy: string;
}

const AlbumCard = ({ artist, album, search, filterBy }: AlbumCardProps) => {
  function makeAlbumLink() {
    return `/albums/${slugify(artist.name)}/${slugify(album.name)}?search=${encodeURIComponent(
      search
    )}&filter=${filterBy}`;
  }

  return (
    <Link key={album.id} href={makeAlbumLink()} className='block p-2 border rounded'>
      <div className='flex flex-row space-x-2'>
        <img className='w-40 h-40 aspect-square' src={album.artworkUrl ? album.artworkUrl : ''} alt={album.name}></img>
        <div className='m-2 flex flex-col text-start justify-center'>
          <p>{artist.name}</p>
          <p>{album.name}</p>
          <p>{formatDate(album.releaseDate)}</p>
        </div>
      </div>
    </Link>
  );
};
export default AlbumCard;
