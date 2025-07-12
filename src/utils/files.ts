import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { existsSync } from 'fs';

export async function saveFile(f: File) {
  const bytes = await f.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${uuid()}-${f.name}`;
  const artworkUrl = `/uploads/${filename}`;
  const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

  await writeFile(uploadPath, buffer);

  return artworkUrl;
}

export async function deleteFile(f: string) {
  const filePath = path.join(process.cwd(), 'public', f);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }
}
