import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function saveFile(f: File, name: string) {
  const bytes = await f.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fullPathFileName = `/uploads/${name}`;
  const uploadPath = path.join(process.cwd(), 'public/uploads', name);

  await writeFile(uploadPath, buffer);

  return fullPathFileName;
}

export async function deleteFile(f: string) {
  const filePath = path.join(process.cwd(), 'public', f);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }
}
