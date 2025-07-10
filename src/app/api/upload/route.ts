import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { artist, album, releaseDate, tracks } = await req.json();

  let artistRecord = await db.artist.findFirst({
    where: { name: { equals: artist, mode: 'insensitive' } },
  });

  if (!artistRecord) {
    artistRecord = await db.artist.create({ data: { name: artist } });
  }

  const albumRecord = await db.album.create({
    data: {
      name: album,
      releaseDate,
      artistId: artistRecord.id,
      tracks: {
        create: tracks.map((name: string, index: number) => ({ name, number: index + 1 })),
      },
    },
  });

  return NextResponse.json({ success: true, albumId: albumRecord.id });
}
