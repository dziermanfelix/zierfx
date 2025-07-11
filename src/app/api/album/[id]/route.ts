import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const albumId = params.id;
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

  const updated = await db.album.update({
    where: { id: Number(albumId) },
    data: {
      name,
      releaseDate: new Date(releaseDate),
      ...(artworkUrl && { artworkUrl }),
    },
  });

  return NextResponse.json({ success: true, album: updated });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  console.log('ok, delete was called');
  const albumId = params.id;

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
