import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function MusicPage({ params }: { params: { slug: string } }) {
  const album = await db.album.findFirst({
    where: { name: params.slug.replace(/-/g, ' ') },
    include: { tracks: true, artist: true },
  });

  if (!album) return notFound();

  return (
    <div>
      <h1>{album.name}</h1>
      <p>
        {album.artist.name} - {album.year}
      </p>
      <ul>
        {album.tracks.map((track) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
}
