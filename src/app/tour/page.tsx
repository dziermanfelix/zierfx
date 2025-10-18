export const dynamic = 'force-dynamic';

import { db } from '@/lib/prisma';
import { Suspense } from 'react';
import TourDateCard from '@/components/TourDateCard';
import MenuBar from '@/components/MenuBar';

export default async function TourPage() {
  const tourDates = await db.tourDate.findMany({
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
      <MenuBar />
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Tour Dates</h1>
          <p className='text-gray-600 dark:text-gray-400'>Catch us live at these upcoming shows</p>
        </div>

        <Suspense fallback={<div>Loading tour dates...</div>}>
          {tourDates.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-xl text-gray-500 dark:text-gray-400'>
                No upcoming tour dates scheduled at the moment.
              </p>
              <p className='text-gray-500 dark:text-gray-400 mt-2'>Check back soon!</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {tourDates.map((tourDate) => (
                <TourDateCard key={tourDate.id} tourDate={tourDate} />
              ))}
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}
