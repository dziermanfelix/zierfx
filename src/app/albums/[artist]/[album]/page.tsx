import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';

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
      <h1 className='text-3xl font-bold'>
        {albumRecord.name} ({albumRecord.year})
      </h1>
      <h2 className='text-xl text-gray-600'>by {artistRecord.name}</h2>

      <ul className='list-disc ml-5 mt-4'>
        {albumRecord.tracks.map((track) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </main>
  );
}
