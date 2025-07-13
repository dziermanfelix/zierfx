import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { existsSync } from 'fs';
import { slugify } from './slugify';

export function makeAlbumArtworkFileName(filename: string, artist?: string, album?: string) {
  const extension = filename.split('.').pop();
  return artist && album ? `${slugify(`${artist}_${album}_artwork`)}.${extension}` : undefined;
}

export function makeTrackFileName(
  filename: string,
  trackNumber: number,
  artist?: string,
  album?: string,
  track?: string
) {
  const extension = filename.split('.').pop();
  return artist && album && track ? `${slugify(`${artist}_${album}_${trackNumber}_${track}`)}.${extension}` : undefined;
}

export async function saveFile(f: File, name?: string) {
  const bytes = await f.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = name ? name : `${uuid()}-${f.name}`;
  const fileName = `/uploads/${filename}`;
  const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

  await writeFile(uploadPath, buffer);

  return fileName;
}

export async function deleteFile(f: string) {
  const filePath = path.join(process.cwd(), 'public', f);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }
}
