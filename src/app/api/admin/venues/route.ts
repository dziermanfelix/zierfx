import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();

    const venues = await db.venue.findMany({
      orderBy: [
        { name: 'asc' },
        { city: 'asc' },
      ],
      include: {
        _count: {
          select: { shows: true },
        },
      },
    });

    return NextResponse.json(venues);
  } catch (error: any) {
    console.error('Error fetching venues:', error);
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 });
  }
}

