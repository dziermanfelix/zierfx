import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    // Ensure user is admin
    await requireAdmin();

    // Get total counts
    const [totalAlbums, totalTracks, totalArtists] = await Promise.all([
      db.album.count(),
      db.track.count(),
      db.artist.count(),
    ]);

    // Get recent albums with artist info and track counts
    const recentAlbums = await db.album.findMany({
      take: 10,
      orderBy: { id: 'desc' },
      include: {
        artist: {
          select: {
            name: true,
            slug: true,
          },
        },
        tracks: {
          select: {
            id: true,
          },
        },
      },
    });

    // Format the data
    const formattedAlbums = recentAlbums.map((album) => ({
      id: album.id,
      name: album.name,
      artist: album.artist,
      releaseDate: album.releaseDate.toISOString(),
      trackCount: album.tracks.length,
      adminOnly: album.adminOnly,
    }));

    return NextResponse.json({
      totalAlbums,
      totalTracks,
      totalArtists,
      recentAlbums: formattedAlbums,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
