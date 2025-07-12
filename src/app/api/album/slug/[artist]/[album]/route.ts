import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: Promise<{ artist: string; album: string }> }) {
  const { artist, album } = await context.params;

  const artistRecord = await db.artist.findFirst({
    where: {
      name: {
        equals: artist.replace(/-/g, ' '),
        mode: 'insensitive',
      },
    },
  });

  if (!artistRecord) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }

  const albumRecord = await db.album.findFirst({
    where: {
      name: {
        equals: album.replace(/-/g, ' '),
        mode: 'insensitive',
      },
      artistId: artistRecord.id,
    },
    include: {
      tracks: true,
    },
  });

  if (!albumRecord) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }

  return NextResponse.json({
    album: albumRecord,
    artistName: artistRecord.name,
  });
}
