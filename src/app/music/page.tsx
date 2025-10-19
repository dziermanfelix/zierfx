export const dynamic = 'force-dynamic';

import { db } from '@/lib/prisma';
import { Suspense } from 'react';
import Library from '@/components/Library';

export default async function LibraryPage() {
  const artists = await db.artist.findMany({
    include: {
      albums: {
        include: {
          tracks: true,
        },
      },
    },
  });

  return (
    <main className='min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-8 py-8'>
        {/* Hero Header */}
        <div className='mb-12 text-center'>
          <div className='inline-block'>
            <h1 className='text-5xl sm:text-6xl font-bold text-black mb-3'>Music</h1>
            <div className='h-1 bg-gradient-to-r from-black via-gray-700 to-gray-500 rounded-full'></div>
          </div>
          <p className='mt-4 text-gray-700 text-lg font-medium'>Discover and explore your collection</p>
        </div>

        <Suspense
          fallback={
            <div className='flex items-center justify-center h-64'>
              <div className='animate-pulse text-gray-500 text-xl'>Loading your library...</div>
            </div>
          }
        >
          <Library artists={artists} />
        </Suspense>
      </div>
    </main>
  );
}
