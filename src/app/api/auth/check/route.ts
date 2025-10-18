import { NextResponse } from 'next/server';
import { getAuthFromCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const auth = await getAuthFromCookie();

  if (!auth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: auth.userId,
      username: auth.username,
      role: auth.role,
    },
  });
}
