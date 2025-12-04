export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { db } from '@/lib/prisma';
import { Suspense } from 'react';
import ShowCard from '@/components/ShowCard';
import { LIVE_PAGE_VIDEO_1_URL, LIVE_PAGE_VIDEO_2_URL } from '@/config/links';

export const metadata: Metadata = {
  title: 'Live Shows & Concerts | Zierman Felix',
  description:
    'See Zierman Felix live in concert. Check out upcoming tour dates, live performances, and concert videos. Book tickets for live shows.',
  keywords: [
    'Zierman Felix live',
    'concerts',
    'tour dates',
    'live shows',
    'tickets',
    'performances',
    'live music',
    'concert videos',
  ],
  openGraph: {
    title: 'Live Shows & Concerts | Zierman Felix',
    description:
      'See Zierman Felix live in concert. Check out upcoming tour dates, live performances, and concert videos.',
    type: 'website',
    url: 'https://ziermanfelix.com/live',
  },
  alternates: {
    canonical: 'https://ziermanfelix.com/live',
  },
};

export default async function LivePage() {
  const shows = await db.show.findMany({
    where: {
      date: {
        gte: new Date(), // Only show upcoming dates
      },
    },
    include: {
      venue: true,
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
        </div>

        <Suspense fallback={<div>Loading live shows...</div>}>
          {shows.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-xl text-gray-500 dark:text-gray-400'>
                No upcoming live shows scheduled at the moment.
              </p>
              <p className='text-gray-500 dark:text-gray-400 mt-2'>Check back soon!</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {shows.map((show) => (
                <ShowCard key={show.id} show={show} />
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
                src={LIVE_PAGE_VIDEO_1_URL}
                title='YouTube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            </div>

            {/* Video 2 */}
            <div className='aspect-video w-full'>
              <iframe
                className='w-full h-full rounded-lg shadow-lg'
                src={LIVE_PAGE_VIDEO_2_URL}
                title='YouTube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
