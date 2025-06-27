import { db } from '@/lib/prisma';

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
    <main className='p-8 space-y-6'>
      <h1 className='text-3xl font-bold'>Zierfx</h1>

      {artists.map((artist) => (
        <div key={artist.id} className='border p-4 rounded-xl shadow'>
          <h2 className='text-xl font-semibold'>{artist.name}</h2>

          {artist.albums.map((album) => (
            <div key={album.id} className='mt-2 ml-4'>
              <h3 className='text-lg font-medium'>
                {album.name} ({album.year})
              </h3>
              <ul className='list-disc ml-5'>
                {album.tracks.map((track) => (
                  <li key={track.id}>{track.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
