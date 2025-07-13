import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { makeAlbumArtworkFileName, makeTrackFileName, saveFile } from '@/utils/files';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const artistString = formData.get('artist') as string;
  const albumString = formData.get('album') as string;
  const releaseDate = formData.get('releaseDate') as string;

  const artwork = formData.get('artwork') as File | null;
  let artworkUrl: string | null = null;
  if (artwork) {
    artworkUrl = await saveFile(artwork, makeAlbumArtworkFileName(artwork.name, artistString, albumString));
  }

  type IncomingTrack = { name: string; file: File | null };

  const trackMap = new Map<number, IncomingTrack>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^tracks\[(\d+)]\[(name|file)]$/);
    if (!match) continue;

    const index = parseInt(match[1]);
    const field = match[2];

    if (!trackMap.has(index)) {
      trackMap.set(index, { name: '', file: null });
    }

    const track = trackMap.get(index)!;

    if (field === 'name' && typeof value === 'string') {
      track.name = value;
    } else if (field === 'file' && value instanceof File) {
      track.file = value;
    }
  }

  const tracksToCreate = await Promise.all(
    Array.from(trackMap.entries())
      .sort(([a], [b]) => a - b)
      .map(async ([i, { name, file }]) => {
        let audioUrl: string | null = null;
        if (file) {
          audioUrl = await saveFile(file, `${makeTrackFileName(file.name, i + 1, artistString, albumString, name)}`);
        }
        return {
          name,
          number: i + 1,
          audioUrl,
        };
      })
  );

  let artist = await db.artist.findFirst({
    where: { name: { equals: artistString, mode: 'insensitive' } },
  });

  if (!artist) {
    artist = await db.artist.create({ data: { name: artistString } });
  }

  const album = await db.album.create({
    data: {
      name: albumString,
      releaseDate: new Date(releaseDate),
      artworkUrl,
      artistId: artist.id,
      tracks: { create: tracksToCreate },
    },
  });

  return NextResponse.json({ success: true, albumId: album.id });
}
