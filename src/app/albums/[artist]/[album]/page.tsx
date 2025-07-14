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
    <main className='p-8 space-y-4'>
      <div className='p-2'>
        <LibraryLink />
      </div>
      <AlbumInfo album={album} artist={artist} />
    </main>
  );
}
