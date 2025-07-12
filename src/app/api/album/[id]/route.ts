import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const albumId = Number(id);

  const formData = await req.formData();
  const albumName = formData.get('albumName')?.toString();
  const artworkFile = formData.get('artwork') as File | null;

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

  if (artworkFile instanceof File) {
    const bytes = await artworkFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), 'public', 'uploads', artworkFile.name);
    await writeFile(filePath, buffer);
    updateData.artworkUrl = `/uploads/${artworkFile.name}`;
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

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const albumId = Number(id);

  const formData = await req.formData();

  const name = formData.get('name') as string;
  const releaseDate = formData.get('releaseDate') as string;
  const artwork = formData.get('artwork') as File | null;

  let artworkUrl: string | undefined;

  if (artwork) {
    const bytes = await artwork.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${artwork.name}`;
    const uploadPath = path.join(process.cwd(), 'public/uploads', filename);
    await writeFile(uploadPath, buffer);
    artworkUrl = `/uploads/${filename}`;
  }

  const updatedAlbum = await db.album.update({
    where: { id: Number(albumId) },
    data: {
      name,
      releaseDate: new Date(releaseDate),
      ...(artworkUrl && { artworkUrl }),
    },
    include: { tracks: true },
  });

  return NextResponse.json({ success: true, album: updatedAlbum });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const albumId = Number(id);

  const album = await db.album.findUnique({
    where: { id: Number(albumId) },
  });

  if (!album) {
    return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });
  }

  // remove file(s)
  if (album.artworkUrl) {
    const filePath = path.join(process.cwd(), 'public', album.artworkUrl);
    try {
      await unlink(filePath);
      console.log(`Deleted artwork file: ${filePath}`);
    } catch (err) {
      console.warn('Failed to delete artwork file:', err);
    }
  }

  await db.album.delete({
    where: { id: Number(albumId) },
  });

  return NextResponse.json({ success: true });
}
