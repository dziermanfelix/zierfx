import { NextRequest, NextResponse } from 'next/server';
import { SUPABASE_BUCKET, USE_SUPABASE_STORAGE } from '@/env';
import path from 'path';
import fs from 'fs/promises';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'Missing url param' }, { status: 400 });

  const filename = url.split('/').pop() || 'track.wav';

  if (USE_SUPABASE_STORAGE) {
    const storagePath = extractPathFromPublicUrl(url);
    const signedUrl = await getSignedUrl(storagePath);
    if (!signedUrl) return NextResponse.json({ error: 'Failed to get signed URL' }, { status: 500 });

    const fileRes = await fetch(signedUrl + '&download=1');

    if (!fileRes.ok) {
      console.error('Error fetching from Supabase signed URL:', await fileRes.text());
      return NextResponse.json({ error: 'Failed to fetch file from Supabase' }, { status: 500 });
    }

    const fileBuffer = await fileRes.arrayBuffer();

    return new NextResponse(Buffer.from(fileBuffer), {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } else {
    try {
      const parsed = new URL(url, 'http://localhost');
      const pathname = parsed.pathname;
      const cleanPath = pathname.replace(/^\/+/, '');
      const localFilePath = path.join(process.cwd(), 'public', cleanPath);

      const fileBuffer = await fs.readFile(localFilePath);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch (err) {
      console.error('Error reading local file:', err);
      return NextResponse.json({ error: 'Local file not found or invalid URL' }, { status: 404 });
    }
  }
}

async function getSignedUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET!).createSignedUrl(storagePath, 60);

  if (!data || error) {
    console.error('Signed URL error:', error);
    return null;
  }

  return data.signedUrl;
}

function extractPathFromPublicUrl(url: string): string {
  const match = url.match(/\/object\/public\/albums\/(.+)$/);
  if (!match) throw new Error('Invalid Supabase public URL');
  return match[1];
}
