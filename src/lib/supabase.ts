import { SUPABASE_ANON_KEY, SUPABASE_BUCKET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/env';
import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (subject to RLS)
export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

// Server-side Supabase client with admin privileges (bypasses RLS)
// Only use this on the server side (API routes)
export const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export async function saveFileSupabase(file: File, name: string) {
  // Use admin client if available (server-side), otherwise use regular client
  const client = supabaseAdmin || supabase;
  
  const { error } = await client.storage.from(SUPABASE_BUCKET).upload(name, file, {
    upsert: true,
  });
  if (error) throw error;

  const { data } = client.storage.from(SUPABASE_BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

export async function deleteFileSupabase(path: string) {
  // Use admin client if available (server-side), otherwise use regular client
  const client = supabaseAdmin || supabase;
  
  const fileName = extractFilenameFromPublicUrl(path);
  const { error } = await client.storage.from(SUPABASE_BUCKET).remove([fileName]);
  if (error) throw error;
}

function extractFilenameFromPublicUrl(url: string) {
  return decodeURIComponent(url.split('/').pop()!);
}
