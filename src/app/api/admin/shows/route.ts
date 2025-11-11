import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();
    const body = await request.json();
    const { date, time, endTime, venueId, venue, city, state, country, ticketUrl, isFree, description } = body;

    // Validate required fields
    if (!date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: date and time are required' },
        { status: 400 }
      );
    }

    // Determine or create venue
    let finalVenueId: number;
    
    if (venueId) {
      // Use existing venue
      finalVenueId = venueId;
    } else {
      // Create or find venue from provided details
      if (!venue || !city || !country) {
        return NextResponse.json(
          { error: 'Missing required venue fields: venue name, city, and country are required' },
          { status: 400 }
        );
      }

      // Try to find existing venue or create new one
      const existingVenue = await db.venue.findUnique({
        where: {
          name_city_country: {
            name: venue,
            city,
            country,
          },
        },
      });

      if (existingVenue) {
        finalVenueId = existingVenue.id;
      } else {
        const newVenue = await db.venue.create({
          data: {
            name: venue,
            city,
            state: state || null,
            country,
          },
        });
        finalVenueId = newVenue.id;
      }
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
        venueId: finalVenueId,
        ticketUrl: ticketUrl || null,
        isFree: isFree || false,
        description: description || null,
      },
      include: {
        venue: true,
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
      include: {
        venue: true,
      },
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

