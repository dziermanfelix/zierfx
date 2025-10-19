import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import LibraryLink from '@/components/LIbraryLink';
import AlbumInfo from '@/components/AlbumInfo';
import { getAlbumAndArtistFromSlugs } from '@/lib/lookup';

type AlbumPageProps = {
  params: Promise<{
    artist: string;
    album: string;
  }>;
};

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { artist: artistParam, album: albumParam } = await params;

  const { artist, album } = await getAlbumAndArtistFromSlugs(artistParam, albumParam);

  if (!artist || !album) return notFound();

  return (
    <main className='min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-8 py-8'>
        <div className='mb-6'>
          <Suspense fallback={<div className='animate-pulse text-gray-500'>Loading...</div>}>
            <LibraryLink />
          </Suspense>
        </div>
        <AlbumInfo album={album} artist={artist} />
      </div>
    </main>
  );
}
