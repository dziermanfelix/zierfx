import { saveFile as saveLocalFile, deleteFile as deleteLocalFile } from './local';
import { saveFileSupabase, deleteFileSupabase } from './supabase';
import { v4 as uuid } from 'uuid';

const storageDriver = process.env.STORAGE_DRIVER;

export async function saveFile(file: File, name?: string) {
  const filename = name || `${uuid()}-${file.name}`;
  if (storageDriver === 'supabase') {
    return saveFileSupabase(file, filename);
  } else {
    return saveLocalFile(file, filename);
  }
}

export async function deleteFile(path: string) {
  if (storageDriver === 'supabase') {
    return deleteFileSupabase(path);
  } else {
    return deleteLocalFile(path);
  }
}
