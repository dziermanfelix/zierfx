import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getTrackLength, makeAlbumArtworkFileName, makeTrackFileName } from '@/utils/files';
import { deleteFile, saveFile } from '@/lib/storage';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const albumId = Number(id);

  const formData = await req.formData();
  const artistName = formData.get('artistName')?.toString();
  const albumName = formData.get('albumName')?.toString();
  const releaseDate = formData.get('releaseDate') as string;
  const adminOnly = formData.get('adminOnly')?.toString() === 'true';
  const artwork = formData.get('artwork') as File | null;

  const tracks = [];
  for (let i = 0; ; i++) {
    const id = formData.get(`tracks[${i}][id]`);
    const name = formData.get(`tracks[${i}][name]`)?.toString();
    const number = Number(formData.get(`tracks[${i}][number]`));
    const downloadable = formData.get(`tracks[${i}][downloadable]`)?.toString() === 'true';
    const file = formData.get(`tracks[${i}][file]`);

    if (!id || !name) break;

    let audioUrl: string | null = null;
    let length: number | null = null;

    if (file instanceof File) {
      const existingTrack = await db.track.findUnique({
        where: { id: Number(id) },
      });

      const existingTrackAudioUrl = existingTrack?.audioUrl;
      if (existingTrackAudioUrl) {
        await deleteFile(existingTrackAudioUrl);
      }

      audioUrl = await saveFile(file, makeTrackFileName(file.name, number, artistName, albumName, name));
      length = await getTrackLength(file);
    }

    tracks.push({
      id: Number(id),
      name: name.toString(),
      audioUrl,
      length,
      downloadable,
    });
  }

  const updateData: { name?: string; releaseDate?: Date; artworkUrl?: string; adminOnly?: boolean } = {};

  if (albumName) updateData.name = albumName;

  if (releaseDate) updateData.releaseDate = new Date(releaseDate);

  updateData.adminOnly = adminOnly;

  if (artwork instanceof File && artwork.size > 0) {
    const existingAlbum = await db.album.findUnique({
      where: { id: albumId },
    });

    const existingArtworkUrl = existingAlbum?.artworkUrl;
    if (existingArtworkUrl) {
      await deleteFile(existingArtworkUrl);
    }

    updateData.artworkUrl = await saveFile(artwork, makeAlbumArtworkFileName(artwork.name, artistName, albumName));
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
        downloadable: track.downloadable,
        ...(track.audioUrl && { audioUrl: track.audioUrl }),
        ...(track.length && { length: track.length }),
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

  const tracks = await db.track.findMany({
    where: { albumId: albumId },
  });

  if (!album) {
    return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });
  }

  if (album.artworkUrl) {
    await deleteFile(album.artworkUrl);
  }

  tracks.map((track) => {
    if (track.audioUrl) deleteFile(track.audioUrl);
  });

  await db.album.delete({
    where: { id: Number(albumId) },
  });

  return NextResponse.json({ success: true });
}
