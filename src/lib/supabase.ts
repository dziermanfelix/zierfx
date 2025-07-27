import { SUPABASE_ANON_KEY, SUPABASE_BUCKET, SUPABASE_URL } from '@/env';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

export async function saveFileSupabase(file: File, name: string) {
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(name, file, {
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

export async function deleteFileSupabase(path: string) {
  const fileName = extractFilenameFromPublicUrl(path);
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([fileName]);
  if (error) throw error;
}

function extractFilenameFromPublicUrl(url: string) {
  return decodeURIComponent(url.split('/').pop()!);
}
