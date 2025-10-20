export const dynamic = 'force-dynamic';

import { db } from '@/lib/prisma';
import { Suspense } from 'react';
import LiveDateCard from '@/components/LiveDateCard';

export default async function LivePage() {
  const liveDates = await db.liveDate.findMany({
    where: {
      date: {
        gte: new Date(), // Only show upcoming dates
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return (
    <main className='p-4 sm:p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Live Shows</h1>
          <p className='text-gray-600 dark:text-gray-400'>Catch us live at these upcoming shows</p>
        </div>

        <Suspense fallback={<div>Loading live shows...</div>}>
          {liveDates.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-xl text-gray-500 dark:text-gray-400'>
                No upcoming live shows scheduled at the moment.
              </p>
              <p className='text-gray-500 dark:text-gray-400 mt-2'>Check back soon!</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {liveDates.map((liveDate) => (
                <LiveDateCard key={liveDate.id} liveDate={liveDate} />
              ))}
            </div>
          )}
        </Suspense>

        {/* Videos Section */}
        <div className='mt-16 border-t border-gray-200 dark:border-gray-800 pt-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Video 1 */}
            <div className='aspect-video w-full'>
              <iframe
                className='w-full h-full rounded-lg shadow-lg'
                src='https://www.youtube.com/embed/0S93YELBZ50'
                title='YouTube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            </div>

            {/* Video 2 */}
            <div className='aspect-video w-full'>
              <iframe
                className='w-full h-full rounded-lg shadow-lg'
                src='https://www.youtube.com/embed/g_c7m4SFNQU'
                title='YouTube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Connect Section */}
        <div className='mt-16 border-t border-gray-200 dark:border-gray-800 pt-12'>
          <div className='text-center'>
            <h2 className='text-3xl sm:text-4xl font-bold mb-8'>Connect</h2>
            <div className='flex flex-wrap justify-center gap-4'>
              <a
                href='https://instagram.com/ziermanfelix'
                target='_blank'
                rel='noopener noreferrer'
                className='group flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white hover:scale-105 transition-transform shadow-lg'
              >
                <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
                <span className='font-semibold text-sm'>Instagram</span>
              </a>

              <a
                href='https://youtube.com/@ziermanfelix'
                target='_blank'
                rel='noopener noreferrer'
                className='group flex flex-col items-center gap-2 p-4 rounded-lg bg-red-600 text-white hover:scale-105 transition-transform shadow-lg'
              >
                <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                </svg>
                <span className='font-semibold text-sm'>YouTube</span>
              </a>

              <a
                href='mailto:ziermanfelixmusic@gmail.com'
                className='group flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-800 text-white hover:scale-105 transition-transform shadow-lg'
              >
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                <span className='font-semibold text-sm'>Email</span>
                <span className='text-xs text-gray-300'>ziermanfelixmusic@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
