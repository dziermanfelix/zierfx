import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getTrackLength, makeAlbumArtworkFileName, makeTrackFileName, saveFile } from '@/utils/files';
import { slugify } from '@/utils/slugify';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const artistString = formData.get('artist') as string;
  const albumString = formData.get('album') as string;
  const releaseDate = formData.get('releaseDate') as string;

  const artistSlug = slugify(artistString);
  const albumSlug = slugify(albumString);

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
        let length: number | null = null;

        if (file instanceof File) {
          audioUrl = await saveFile(file, `${makeTrackFileName(file.name, i + 1, artistString, albumString, name)}`);
          length = await getTrackLength(file);
        }

        return {
          name,
          number: i + 1,
          audioUrl,
          length,
        };
      })
  );

  let artist = await db.artist.findFirst({
    where: { name: { equals: artistString, mode: 'insensitive' } },
  });

  if (!artist) {
    artist = await db.artist.create({ data: { name: artistString, slug: artistSlug } });
  }

  const album = await db.album.create({
    data: {
      name: albumString,
      releaseDate: new Date(releaseDate),
      artworkUrl,
      artistId: artist.id,
      tracks: { create: tracksToCreate },
      slug: albumSlug,
    },
  });

  return NextResponse.json({ success: true, albumId: album.id });
}
