import { db } from '@/lib/prisma';
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
    <main className='p-8'>
      <Library artists={artists} />
    </main>
  );
}
