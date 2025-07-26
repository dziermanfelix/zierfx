import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');

  if (!path) {
    return new Response(JSON.stringify({ error: 'Missing path' }), {
      status: 400,
    });
  }

  const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET!).createSignedUrl(path, 60);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ url: data.signedUrl }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
