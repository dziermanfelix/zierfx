export const dynamic = 'force-dynamic';

import { db } from '@/lib/prisma';
import Link from 'next/link';
import { formatDate } from '@/utils/formatting';

export default async function Home() {
  // Get recent albums (latest 6)
  const recentAlbums = await db.album.findMany({
    include: {
      artist: true,
      tracks: true,
    },
    orderBy: {
      releaseDate: 'desc',
    },
    take: 6,
  });

  return (
    <main className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24 px-4 sm:px-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center space-y-6'>
            <h1 className='text-5xl sm:text-7xl font-bold tracking-tight'>Zierfx</h1>
            <p className='text-xl sm:text-2xl font-light text-blue-100'>Yeebob Records</p>
            <p className='text-lg sm:text-xl max-w-2xl mx-auto text-white/90'>
              Discover and stream music from independent artists. Upload your own tracks and build your collection.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-6'>
              <Link
                href='/library'
                className='bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg'
              >
                Browse Library
              </Link>
              <Link
                href='/upload'
                className='bg-purple-500/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-500/30 transition-colors'
              >
                Upload Music
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Releases Section */}
      <section className='py-16 px-4 sm:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-3xl sm:text-4xl font-bold'>Recent Releases</h2>
            <Link href='/library' className='text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2'>
              View All
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>

          {recentAlbums.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6'>
              {recentAlbums.map((album) => (
                <Link key={album.id} href={`/albums/${album.artist.slug}/${album.slug}`} className='group'>
                  <div className='space-y-3'>
                    <div className='aspect-square relative overflow-hidden rounded-lg shadow-lg bg-gray-200 dark:bg-gray-800 group-hover:shadow-xl transition-shadow'>
                      {album.artworkUrl ? (
                        <img src={album.artworkUrl} alt={album.name} className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-gray-400'>
                          <svg className='w-16 h-16' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z' />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className='space-y-1'>
                      <h3 className='font-semibold line-clamp-1 group-hover:text-blue-600 transition-colors'>
                        {album.name}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1'>{album.artist.name}</p>
                      <p className='text-xs text-gray-500 dark:text-gray-500'>{formatDate(album.releaseDate)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='text-center py-16 text-gray-500'>
              <svg className='w-16 h-16 mx-auto mb-4 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z' />
              </svg>
              <p className='text-lg'>No albums yet</p>
              <Link href='/upload' className='text-blue-600 hover:text-blue-700 mt-2 inline-block'>
                Upload your first album
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-4 sm:px-8 bg-gray-50 dark:bg-gray-900/50'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-3xl sm:text-4xl font-bold text-center mb-12'>Features</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Stream Music</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Listen to your favorite tracks with our built-in audio player
              </p>
            </div>

            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Upload Albums</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Share your music with the world by uploading tracks and albums
              </p>
            </div>

            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-pink-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Organize Library</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Search and filter your collection by artist, album, or track
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
