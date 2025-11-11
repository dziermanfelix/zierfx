import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getTrackLength, makeAlbumArtworkFileName, makeTrackFileName } from '@/utils/files';
import { saveFile } from '@/lib/storage';
import { slugify } from '@/utils/slugify';
import { Prisma } from '@prisma/client';

// Note: Large file upload limits are configured in vercel.json and next.config.ts
// Vercel Pro/Enterprise plans support up to 100MB request bodies

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const artistString = formData.get('artist') as string;
  const albumString = formData.get('album') as string;
  const releaseDate = formData.get('releaseDate') as string;
  const adminOnly = formData.get('adminOnly') === 'true';

  const artistSlug = slugify(artistString);
  const albumSlug = slugify(albumString);

  const artwork = formData.get('artwork') as File | null;
  let artworkUrl: string | null = null;
  if (artwork) {
    artworkUrl = await saveFile(artwork, makeAlbumArtworkFileName(artwork.name, artistString, albumString));
  }

  type IncomingTrack = { name: string; file: File | null; downloadable: boolean };

  const trackMap = new Map<number, IncomingTrack>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^tracks\[(\d+)]\[(name|file|downloadable)]$/);
    if (!match) continue;

    const index = parseInt(match[1]);
    const field = match[2];

    if (!trackMap.has(index)) {
      trackMap.set(index, { name: '', file: null, downloadable: true });
    }

    const track = trackMap.get(index)!;

    if (field === 'name' && typeof value === 'string') {
      track.name = value;
    } else if (field === 'file' && value instanceof File) {
      track.file = value;
    } else if (field === 'downloadable' && typeof value === 'string') {
      track.downloadable = value === 'true';
    }
  }

  const tracksToCreate = await Promise.all(
    Array.from(trackMap.entries())
      .sort(([a], [b]) => a - b)
      .map(async ([i, { name, file, downloadable }]) => {
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
          downloadable,
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
      adminOnly,
      artistId: artist.id,
      slug: albumSlug,
      tracks: { create: tracksToCreate },
    } as Prisma.AlbumUncheckedCreateInput,
  });

  return NextResponse.json({ success: true, albumId: album.id });
}
