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
      </div>
    </main>
  );
}

