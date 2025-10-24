import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import LibraryLink from '@/components/LIbraryLink';
import AlbumInfo from '@/components/AlbumInfo';
import StructuredData from '@/components/StructuredData';
import { getAlbumAndArtistFromSlugs } from '@/lib/lookup';

type AlbumPageProps = {
  params: Promise<{
    artist: string;
    album: string;
  }>;
};

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { artist: artistParam, album: albumParam } = await params;
  const { artist, album } = await getAlbumAndArtistFromSlugs(artistParam, albumParam);

  if (!artist || !album) {
    return {
      title: 'Album Not Found',
      description: 'The requested album could not be found.',
    };
  }

  const title = `${album.name} by ${artist.name} | Zierman Felix`;
  const description = `Listen to ${album.name} by ${artist.name}. Released ${
    album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : 'TBA'
  }. Stream and download on Zierman Felix's official website.`;

  return {
    title,
    description,
    keywords: [album.name, artist.name, 'Zierman Felix', 'music', 'album', 'streaming', 'download'],
    openGraph: {
      title,
      description,
      type: 'music.album',
      url: `https://ziermanfelix.com/albums/${artist.slug}/${album.slug}`,
      images: album.artworkUrl
        ? [
            {
              url: `https://ziermanfelix.com${album.artworkUrl}`,
              width: 1200,
              height: 1200,
              alt: `${album.name} by ${artist.name}`,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: album.artworkUrl ? [`https://ziermanfelix.com${album.artworkUrl}`] : [],
    },
    alternates: {
      canonical: `https://ziermanfelix.com/albums/${artist.slug}/${album.slug}`,
    },
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { artist: artistParam, album: albumParam } = await params;

  const { artist, album } = await getAlbumAndArtistFromSlugs(artistParam, albumParam);

  if (!artist || !album) return notFound();

  return (
    <>
      <StructuredData type='MusicAlbum' data={{ ...album, artist }} />
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
    </>
  );
}
