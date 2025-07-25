import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function saveFileSupabase(file: File, name: string) {
  const { error } = await supabase.storage.from('albums').upload(name, file, {
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('albums').getPublicUrl(name);
  return data.publicUrl;
}

export async function deleteFileSupabase(path: string) {
  const fileName = extractFilenameFromPublicUrl(path);
  const { data, error } = await supabase.storage.from('albums').remove([fileName]);
  if (error) throw error;
}

function extractFilenameFromPublicUrl(url: string) {
  return decodeURIComponent(url.split('/').pop()!);
}
