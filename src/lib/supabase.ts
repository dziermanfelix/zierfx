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
  // Always use admin client for server-side operations (bypasses RLS)
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. SUPABASE_SERVICE_ROLE_KEY is required for file uploads.');
  }

  const { error } = await supabaseAdmin.storage.from(SUPABASE_BUCKET).upload(name, file, {
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabaseAdmin.storage.from(SUPABASE_BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

export async function deleteFileSupabase(path: string) {
  // Always use admin client for server-side operations (bypasses RLS)
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. SUPABASE_SERVICE_ROLE_KEY is required for file deletions.');
  }

  const fileName = extractFilenameFromPublicUrl(path);
  const { error } = await supabaseAdmin.storage.from(SUPABASE_BUCKET).remove([fileName]);
  if (error) throw error;
}

function extractFilenameFromPublicUrl(url: string) {
  return decodeURIComponent(url.split('/').pop()!);
}
