import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token');

  // Check if user is authenticated
  if (!token || !verifyAuthToken(token.value)) {
    // Redirect to login page with return URL
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/albums/(.*)/edit', '/upload'],
};
