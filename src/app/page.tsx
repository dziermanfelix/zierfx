export const dynamic = 'force-dynamic';

import { db } from '@/lib/prisma';
import { Suspense } from 'react';
import Library from '@/components/Library';

export default async function Home() {
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
      <Suspense fallback={<div>Loading Library...</div>}>
        <Library artists={artists} />
      </Suspense>
    </main>
  );
}
