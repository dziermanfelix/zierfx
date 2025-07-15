import { getAlbumAndArtistFromSlugs } from '@/lib/lookup';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: Promise<{ artist: string; album: string }> }) {
  const { artist: artistParam, album: albumParam } = await context.params;

  const { artist, album } = await getAlbumAndArtistFromSlugs(artistParam, albumParam);

  if (!artist) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }

  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }

  return NextResponse.json({
    album: album,
    artist: artist,
  });
}
