import { AlbumWithTracks, ArtistWithAlbumAndTracks, TrackWithAlbumAndArtist } from '@/types/music';
import Link from 'next/link';
import { makeAlbumLink } from '@/utils/slugify';
import { formatDate } from '@/utils/formatting';
import AlbumCoverWithPlay from './AlbumCoverWithPlay';
import { useIsMobile } from '@/utils/mobile';

interface AlbumCardProps {
  artist: ArtistWithAlbumAndTracks;
  album: AlbumWithTracks;
  search: string;
  filterBy: string;
}

const AlbumCard = ({ artist, album, search, filterBy }: AlbumCardProps) => {
  const isMobile = useIsMobile();
  const tracks: TrackWithAlbumAndArtist[] = album.tracks.map((track) => ({
    ...track,
    album: { ...album, artist },
    artist, // Flatten artist for easier access
  }));

  return (
    <Link
      key={album.id}
      href={makeAlbumLink(artist.slug, album.slug, search, filterBy)}
      className='block p-3 border rounded hover:border-blue-300 transition-colors'
    >
      <div className={`${isMobile ? 'flex flex-col items-center space-y-2' : 'flex flex-row space-x-2'}`}>
        <div className={`${isMobile ? 'flex justify-center' : ''}`}>
          <AlbumCoverWithPlay tracks={tracks} dim={isMobile ? 120 : 120} />
        </div>
        <div
          className={`${
            isMobile ? 'flex flex-col text-center space-y-1' : 'm-2 flex flex-col text-start justify-center'
          }`}
        >
          <p className={`${isMobile ? 'font-medium text-sm' : ''}`}>{artist.name}</p>
          <p className={`${isMobile ? 'font-medium text-sm' : ''}`}>{album.name}</p>
          <p className={`${isMobile ? 'text-sm text-gray-600' : ''}`}>{formatDate(album.releaseDate)}</p>
        </div>
      </div>
    </Link>
  );
};
export default AlbumCard;
