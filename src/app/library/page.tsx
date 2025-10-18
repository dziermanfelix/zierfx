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
    <main className='p-4 sm:p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold mb-6'>Music Library</h1>
        <Suspense fallback={<div>Loading Library...</div>}>
          <Library artists={artists} />
        </Suspense>
      </div>
    </main>
  );
}
