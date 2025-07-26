import { USE_SUPABASE_STORAGE } from '@/env';
import { saveFile as saveLocalFile, deleteFile as deleteLocalFile } from './local';
import { saveFileSupabase, deleteFileSupabase } from './supabase';
import { v4 as uuid } from 'uuid';

export async function saveFile(file: File, name?: string) {
  const filename = name || `${uuid()}-${file.name}`;
  if (USE_SUPABASE_STORAGE) {
    return saveFileSupabase(file, filename);
  } else {
    return saveLocalFile(file, filename);
  }
}

export async function deleteFile(path: string) {
  if (USE_SUPABASE_STORAGE) {
    return deleteFileSupabase(path);
  } else {
    return deleteLocalFile(path);
  }
}
