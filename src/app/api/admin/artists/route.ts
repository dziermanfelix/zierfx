import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// GET - Fetch all artists with album counts
export async function GET() {
  try {
    await requireAdmin();

    const artists = await db.artist.findMany({
      include: {
        albums: {
          include: {
            tracks: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const artistsWithStats = artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      slug: artist.slug,
      albumCount: artist.albums.length,
      trackCount: artist.albums.reduce((total, album) => total + album.tracks.length, 0),
    }));

    return NextResponse.json(artistsWithStats);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
}

// DELETE - Delete an artist and all associated albums/tracks
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const { artistId } = await req.json();

    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }

    // Get artist info before deletion for confirmation
    const artist = await db.artist.findUnique({
      where: { id: artistId },
      include: {
        albums: {
          include: {
            tracks: true,
          },
        },
      },
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Delete the artist (cascade will handle albums and tracks)
    await db.artist.delete({
      where: { id: artistId },
    });

    const albumCount = artist.albums.length;
    const trackCount = artist.albums.reduce((total, album) => total + album.tracks.length, 0);

    let message = `Artist "${artist.name}" has been deleted`;
    if (albumCount > 0) {
      message += ` along with ${albumCount} album(s) and ${trackCount} track(s)`;
    }

    return NextResponse.json({
      success: true,
      message,
      deletedStats: {
        albums: albumCount,
        tracks: trackCount,
      },
    });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 });
  }
}
