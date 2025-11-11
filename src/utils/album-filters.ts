import { getAuthFromCookie } from '@/lib/auth';
import { Prisma } from '@prisma/client';

/**
 * Get the Prisma where clause to filter albums based on user authentication
 * Non-admin users should only see albums where adminOnly is false
 * Admin users should see all albums
 */
export async function getAlbumFilterForUser(): Promise<Prisma.AlbumWhereInput> {
  const auth = await getAuthFromCookie();
  const isAdmin = auth?.role === 'admin';

  // If user is admin, show all albums
  if (isAdmin) {
    return {};
  }

  // Otherwise, only show non-admin-only albums
  return {
    adminOnly: false,
  };
}

/**
 * Check if a user is an admin
 */
export async function isUserAdmin(): Promise<boolean> {
  const auth = await getAuthFromCookie();
  return auth?.role === 'admin';
}

