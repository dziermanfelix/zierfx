import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();
    const body = await request.json();
    const { date, time, endTime, venue, address, city, state, zipCode, country, ticketUrl, isFree, mapsUrl, description } = body;

    // Validate required fields
    if (!date || !time || !venue || !city || !country) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, venue, city, and country are required' },
        { status: 400 }
      );
    }

    // Combine date and time into a single DateTime
    const dateTimeString = `${date}T${time}`;
    const showDate = new Date(dateTimeString);

    // Handle end time if provided
    let showEndTime = null;
    if (endTime) {
      const endTimeString = `${date}T${endTime}`;
      showEndTime = new Date(endTimeString);
    }

    // Create the show
    const show = await db.show.create({
      data: {
        date: showDate,
        endTime: showEndTime,
        venue,
        address: address || null,
        city,
        state: state || null,
        zipCode: zipCode || null,
        country,
        ticketUrl: ticketUrl || null,
        isFree: isFree || false,
        mapsUrl: mapsUrl || null,
        description: description || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Show created successfully',
      show,
    });
  } catch (error: any) {
    console.error('Error creating show:', error);
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create show' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();
    const shows = await db.show.findMany({
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(shows);
  } catch (error: any) {
    console.error('Error fetching shows:', error);
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch shows' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();
    const body = await request.json();
    const { showId } = body;

    if (!showId) {
      return NextResponse.json({ error: 'Show ID is required' }, { status: 400 });
    }

    await db.show.delete({
      where: { id: showId },
    });

    return NextResponse.json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting show:', error);
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete show' }, { status: 500 });
  }
}

