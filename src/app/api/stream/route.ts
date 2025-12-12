import { NextRequest, NextResponse } from 'next/server';
import { SUPABASE_BUCKET, USE_SUPABASE_STORAGE } from '@/env';
import { supabaseAdmin, supabase } from '@/lib/supabase';
import path from 'path';
import fs from 'fs/promises';

/**
 * API route to stream audio files
 * This proxies requests to Supabase storage using signed URLs
 * to work around public access requirements
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  if (USE_SUPABASE_STORAGE) {
    try {
      // Extract the storage path from the public URL
      const storagePath = extractPathFromPublicUrl(url);

      // Generate a signed URL (valid for 1 hour for streaming)
      // Use admin client if available (bypasses RLS), otherwise fall back to regular client
      const client = supabaseAdmin || supabase;
      const { data, error } = await client.storage.from(SUPABASE_BUCKET!).createSignedUrl(storagePath, 3600); // 1 hour expiry

      if (error || !data) {
        console.error('Error creating signed URL:', error);
        return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
      }

      // Get the Range header from the request
      const range = req.headers.get('range');

      // Prepare headers for the Supabase request
      const fetchHeaders: HeadersInit = {};
      if (range) {
        fetchHeaders['Range'] = range;
      }

      // Fetch the file from Supabase (with range support)
      const fileRes = await fetch(data.signedUrl, { headers: fetchHeaders });

      if (!fileRes.ok && fileRes.status !== 206) {
        console.error('Error fetching from Supabase:', await fileRes.text());
        return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
      }

      // Get the content type from the response
      const contentType = fileRes.headers.get('content-type') || 'audio/mpeg';
      const contentLength = fileRes.headers.get('content-length');
      const contentRange = fileRes.headers.get('content-range');

      // Build response headers
      const responseHeaders: HeadersInit = {
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      };

      if (contentLength) {
        responseHeaders['Content-Length'] = contentLength;
      }

      if (contentRange) {
        responseHeaders['Content-Range'] = contentRange;
      }

      // Stream the file back to the client with appropriate status code
      return new NextResponse(fileRes.body, {
        status: fileRes.status === 206 ? 206 : 200,
        headers: responseHeaders,
      });
    } catch (err) {
      console.error('Error streaming from Supabase:', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } else {
    // Local file handling
    try {
      const parsed = new URL(url, 'http://localhost');
      const pathname = parsed.pathname;
      const cleanPath = pathname.replace(/^\/+/, '');
      const localFilePath = path.join(process.cwd(), 'public', cleanPath);

      const fileBuffer = await fs.readFile(localFilePath);

      // Determine content type from file extension
      const ext = path.extname(cleanPath).toLowerCase();
      const contentType =
        ext === '.wav'
          ? 'audio/wav'
          : ext === '.mp3'
          ? 'audio/mpeg'
          : ext === '.ogg'
          ? 'audio/ogg'
          : ext === '.m4a'
          ? 'audio/mp4'
          : 'audio/mpeg';

      return new NextResponse(Buffer.from(fileBuffer), {
        headers: {
          'Content-Type': contentType,
          'Content-Length': fileBuffer.length.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (err) {
      console.error('Error reading local file:', err);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  }
}

function extractPathFromPublicUrl(url: string): string {
  // Extract filename from Supabase public URL
  // Format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
  const match = url.match(/\/object\/public\/[^/]+\/(.+)$/);
  if (match) {
    return decodeURIComponent(match[1]);
  }

  // Fallback: just use the last part of the URL
  return decodeURIComponent(url.split('/').pop() || '');
}
