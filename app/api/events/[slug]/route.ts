import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/database/event.model';

// Define the route context type for dynamic params
interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Await the params (Next.js 15+ requirement)
    const { slug } = await context.params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric with hyphens)
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Must be lowercase alphanumeric with hyphens.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event: IEvent | null = await Event.findOne({ slug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { error: `Event with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (use proper logging service in production)
    console.error('Error fetching event by slug:', error);

    // Handle different error types
    if (error instanceof Error) {
      // Database connection errors
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { error: 'Database configuration error' },
          { status: 500 }
        );
      }

      // Mongoose validation errors
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: 'Invalid event data', details: error.message },
          { status: 400 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the event' },
      { status: 500 }
    );
  }
}
