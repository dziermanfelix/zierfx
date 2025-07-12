import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { deleteFile, saveFile } from '@/utils/files';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const albumId = Number(id);

  const formData = await req.formData();
  const albumName = formData.get('albumName')?.toString();
  const artwork = formData.get('artwork') as File | null;

  const tracks = [];
  for (let i = 0; ; i++) {
    const id = formData.get(`tracks[${i}][id]`);
    const name = formData.get(`tracks[${i}][name]`);
    const file = formData.get(`tracks[${i}][file]`);

    if (!id || !name) break;

    let audioUrl: string | null = null;
    if (file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(process.cwd(), 'public', 'uploads', file.name);
      await writeFile(filePath, buffer);
      audioUrl = `/uploads/${file.name}`;
    }

    tracks.push({
      id: Number(id),
      name: name.toString(),
      audioUrl,
    });
  }

  const updateData: { name?: string; artworkUrl?: string } = {};

  if (albumName) updateData.name = albumName;

  if (artwork instanceof File && artwork.size > 0) {
    const existingAlbum = await db.album.findUnique({
      where: { id: albumId },
    });

    const existingArtworkUrl = existingAlbum?.artworkUrl;
    if (existingArtworkUrl) {
      await deleteFile(existingArtworkUrl);
    }
    updateData.artworkUrl = await saveFile(artwork);
  }

  await db.album.update({
    where: { id: albumId },
    data: updateData,
  });

  for (const track of tracks) {
    await db.track.update({
      where: { id: track.id },
      data: {
        name: track.name,
        ...(track.audioUrl && { audioUrl: track.audioUrl }),
      },
    });
  }

  const updatedAlbum = await db.album.findUnique({
    where: { id: albumId },
    include: { tracks: true },
  });

  return NextResponse.json({ success: true, album: updatedAlbum });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const albumId = Number(id);

  const album = await db.album.findUnique({
    where: { id: albumId },
  });

  if (!album) {
    return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });
  }

  if (album.artworkUrl) {
    await deleteFile(album.artworkUrl);
  }

  await db.album.delete({
    where: { id: Number(albumId) },
  });

  return NextResponse.json({ success: true });
}
