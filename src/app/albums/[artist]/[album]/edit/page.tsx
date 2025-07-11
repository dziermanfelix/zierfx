import { notFound } from 'next/navigation';
import { db } from '@/lib/prisma';
import AlbumInfo from '@/components/AlbumInfo';
import LibraryLink from '@/components/LIbraryLink';

type EditAlbumPageProps = {
  params: {
    artist: string;
    album: string;
  };
};

export default async function EditAlbumPage({ params }: EditAlbumPageProps) {
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
      <AlbumInfo album={albumRecord} artistName={artistRecord.name} showActions />
    </main>
  );
}
