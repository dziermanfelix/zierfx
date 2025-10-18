import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_NAME = 'auth-token';

export interface AuthPayload {
  userId: number;
  username: string;
  role: string;
}

export function createAuthToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAuthToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function setAuthCookie(payload: AuthPayload) {
  const token = createAuthToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getAuthFromCookie(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME);

  if (!token) return null;

  return verifyAuthToken(token.value);
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function requireAuth(): Promise<AuthPayload> {
  const auth = await getAuthFromCookie();

  if (!auth) {
    throw new Error('Authentication required');
  }

  return auth;
}

export async function requireAdmin(): Promise<AuthPayload> {
  const auth = await requireAuth();

  if (auth.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return auth;
}

