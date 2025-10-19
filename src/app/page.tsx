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
      <section className='relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-24 px-4 sm:px-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center space-y-6'>
            <h1 className='text-5xl sm:text-7xl font-bold tracking-tight'>Zierman Felix</h1>
            <p className='text-xl sm:text-2xl font-light text-gray-300'>Yeebob Records</p>
            <p className='text-lg sm:text-xl max-w-2xl mx-auto text-gray-200'>The music of Dustyn Zierman-Felix.</p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-6'>
              <Link
                href='/library'
                className='bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg'
              >
                Listen Now
              </Link>
              <Link
                href='/live'
                className='bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-colors'
              >
                Live Shows
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
            <Link href='/library' className='text-black hover:text-gray-700 font-bold flex items-center gap-2'>
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
                      <h3 className='font-semibold line-clamp-1 group-hover:text-black transition-colors'>
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
              <p className='text-lg'>New music coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Video Section */}
      <section className='py-16 px-4 sm:px-8 bg-gray-50 dark:bg-gray-900/50'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-3xl sm:text-4xl font-bold text-center mb-8'>Featured Video</h2>
          <div className='aspect-video w-full rounded-xl overflow-hidden shadow-2xl'>
            <iframe
              width='100%'
              height='100%'
              src='https://www.youtube.com/embed/g_c7m4SFNQU'
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className='py-16 px-4 sm:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-8'>Connect</h2>
          <div className='flex flex-wrap justify-center gap-6'>
            <a
              href='https://instagram.com/ziermanfelix'
              target='_blank'
              rel='noopener noreferrer'
              className='group flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white hover:scale-105 transition-transform shadow-lg'
            >
              <svg className='w-12 h-12' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
              </svg>
              <span className='font-semibold text-lg'>Instagram</span>
            </a>

            <a
              href='https://youtube.com/@ziermanfelix'
              target='_blank'
              rel='noopener noreferrer'
              className='group flex flex-col items-center gap-3 p-6 rounded-xl bg-red-600 text-white hover:scale-105 transition-transform shadow-lg'
            >
              <svg className='w-12 h-12' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
              </svg>
              <span className='font-semibold text-lg'>YouTube</span>
            </a>

            <a
              href='mailto:ziermanfelixmusic@gmail.com'
              className='group flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-800 text-white hover:scale-105 transition-transform shadow-lg'
            >
              <svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <span className='font-semibold text-lg'>Email</span>
              <span className='text-sm text-gray-300'>ziermanfelixmusic@gmail.com</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
