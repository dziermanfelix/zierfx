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
      <div className='p-4 max-w-7xl mx-auto rounded'>
        <h1 className='text-3xl font-bold'>
          {albumRecord.name} ({formatDate(albumRecord.releaseDate)})
        </h1>
        <h2 className='text-xl text-gray-600'>by {artistRecord.name}</h2>

        <div>
          {albumRecord.artworkUrl && (
            <img
              src={albumRecord.artworkUrl}
              alt={`${albumRecord.name} artwork`}
              className='w-full max-w-sm rounded shadow-md'
            />
          )}
        </div>

        <ul className='list-none mt-4 ml-4'>
          {albumRecord.tracks.map((track) => (
            <li key={track.id}>
              {track.number}. {track.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
