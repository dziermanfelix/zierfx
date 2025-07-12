import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import LibraryLink from '@/components/LIbraryLink';
import AlbumInfo from '@/components/AlbumInfo';

type AlbumPageProps = {
  params: Promise<{
    artist: string;
    album: string;
  }>;
};

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { artist, album } = await params;

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
      <AlbumInfo album={albumRecord} artistName={artistRecord.name} />
    </main>
  );
}
