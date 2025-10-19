import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_NAME = 'auth-token';

export interface AuthPayload {
  userId: number;
  username: string;
  role: string;
}

// Convert secret to Uint8Array for jose
const getSecretKey = () => new TextEncoder().encode(JWT_SECRET);

export async function createAuthToken(payload: AuthPayload): Promise<string> {
  const token = await new SignJWT({
    userId: payload.userId,
    username: payload.username,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
  return token;
}

export async function verifyAuthToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    // Validate that payload has expected fields
    if (
      typeof payload.userId === 'number' &&
      typeof payload.username === 'string' &&
      typeof payload.role === 'string'
    ) {
      return {
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(payload: AuthPayload) {
  const token = await createAuthToken(payload);
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
