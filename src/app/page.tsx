export const dynamic = 'force-dynamic';

import { db } from '@/lib/prisma';
import Link from 'next/link';
import RecentReleasesGrid from '@/components/RecentReleasesGrid';
import StructuredData from '@/components/StructuredData';
import { getAlbumFilterForUser } from '@/utils/album-filters';
import { FEATURED_VIDEO_URL } from '@/config/links';

export default async function Home() {
  const albumFilter = await getAlbumFilterForUser();

  const recentAlbums = await db.album.findMany({
    where: albumFilter,
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
    <>
      <StructuredData type='Person' data={{}} />
      <main className='min-h-screen'>
        {/* Hero Section */}
        <section className='relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-12 px-4 sm:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center space-y-4'>
              <h1 className='text-5xl sm:text-7xl font-bold tracking-tight'>Zierfx</h1>
              <p className='text-lg sm:text-xl max-w-2xl mx-auto text-gray-200'>The music of Dustyn Zierman-Felix.</p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center p-2'>
                <Link
                  href='/music'
                  className='bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg'
                >
                  Listen Now
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
              <Link href='/music' className='text-black hover:text-gray-700 font-bold flex items-center gap-2'>
                View All
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </Link>
            </div>

            {recentAlbums.length > 0 ? (
              <RecentReleasesGrid albums={recentAlbums} />
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
                src={FEATURED_VIDEO_URL}
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
