import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import LibraryLink from '@/components/LIbraryLink';
import { formatDate } from '@/utils/formatting';

type AlbumPageProps = {
  params: {
    artist: string;
    album: string;
  };
};

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { artist, album } = params;

  const artistRecord = await db.artist.findFirst({
    where: {
      name: {
        equals: artist.replace(/-/g, ' '),
        mode: 'insensitive',
      },
    },
  });

  if (!artistRecord) return notFound();

  const albumRecord = await db.album.findFirst({
    where: {
      name: {
        equals: album.replace(/-/g, ' '),
        mode: 'insensitive',
      },
      artistId: artistRecord.id,
    },
    include: {
      tracks: true,
    },
  });

  if (!albumRecord) return notFound();

  return (
    <main className='p-8 space-y-4'>
      <div className='p-2'>
        <LibraryLink />
      </div>

      <div className='p-4 flex flex-col max-w-7xl mx-auto rounded'>
        <div className='flex flex-row'>
          <div className='p-2 mb-3'>
            {albumRecord.artworkUrl && (
              <img
                src={albumRecord.artworkUrl}
                alt={`${albumRecord.name} artwork`}
                className='w-full max-w-sm rounded shadow-md'
              />
            )}
          </div>
          <div className='flex flex-col ml-4 p-2 justify-center'>
            <h1 className='text-2xl font-bold'>{albumRecord.name}</h1>
            <h2 className='text-xl text-gray-600'>{artistRecord.name}</h2>
            <h2 className='text-xl text-gray-600'>{formatDate(albumRecord.releaseDate)}</h2>
          </div>
        </div>

        <ul className='list-none mt-4 ml-4 rounded p-2'>
          {albumRecord.tracks.map((track) => (
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
    </main>
  );
}
