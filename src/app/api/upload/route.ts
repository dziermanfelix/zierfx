import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { artist, album, year, tracks } = await req.json();

  let artistRecord = await db.artist.findFirst({
    where: { name: { equals: artist, mode: 'insensitive' } },
  });

  if (!artistRecord) {
    artistRecord = await db.artist.create({ data: { name: artist } });
  }

  const albumRecord = await db.album.create({
    data: {
      name: album,
      year,
      artistId: artistRecord.id,
      tracks: {
        create: tracks.map((name: string) => ({ name })),
      },
    },
  });

  return NextResponse.json({ success: true, albumId: albumRecord.id });
}
