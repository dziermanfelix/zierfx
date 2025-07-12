import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { saveFile } from '@/utils/files';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const artist = formData.get('artist') as string;
  const album = formData.get('album') as string;
  const releaseDate = formData.get('releaseDate') as string;
  const artwork = formData.get('artwork') as File | null;

  const tracks: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('tracks[') && typeof value === 'string') {
      tracks.push(value);
    }
  }

  let artworkUrl: string | null = null;
  if (artwork) {
    artworkUrl = await saveFile(artwork);
  }

  let artistRecord = await db.artist.findFirst({
    where: { name: { equals: artist, mode: 'insensitive' } },
  });

  if (!artistRecord) {
    artistRecord = await db.artist.create({ data: { name: artist } });
  }

  const albumRecord = await db.album.create({
    data: {
      name: album,
      releaseDate: new Date(releaseDate),
      artworkUrl,
      artistId: artistRecord.id,
      tracks: {
        create: tracks.map((name, i) => ({ name, number: i + 1 })),
      },
    },
  });

  return NextResponse.json({ success: true, albumId: albumRecord.id });
}
