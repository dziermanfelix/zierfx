import {
  AlbumWithTracks,
  ArtistWithAlbumAndTracks,
  makeTrackWithAlbumAndArtist,
  TrackWithAlbumAndArtist,
} from '@/types/music';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';
import { formatDate } from '@/utils/formatting';
import AlbumCoverWithPlay from './AlbumCoverWithPlay';

interface AlbumCardProps {
  artist: ArtistWithAlbumAndTracks;
  album: AlbumWithTracks;
  search: string;
  filterBy: string;
}

const AlbumCard = ({ artist, album, search, filterBy }: AlbumCardProps) => {
  const tracks: TrackWithAlbumAndArtist[] = album.tracks.map((track) =>
    makeTrackWithAlbumAndArtist(track, album, artist)
  );

  function makeAlbumLink() {
    return `/albums/${slugify(artist.name)}/${slugify(album.name)}?search=${encodeURIComponent(
      search
    )}&filter=${filterBy}`;
  }

  return (
    <Link key={album.id} href={makeAlbumLink()} className='block p-2 border rounded hover:border-blue-300'>
      <div className='flex flex-row space-x-2'>
        <AlbumCoverWithPlay tracks={tracks} dim={160} />
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
