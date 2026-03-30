import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * GET /api/events/slug/[slug]
 * Looks up an event by its short URL slug (uppercase title with no spaces/special chars).
 * Searches the backend events API and matches by comparing slugified titles.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 }
    );
  }

  try {
    // Search the backend using the slug as a search query
    const searchUrl = `${API_BASE_URL}/events?search=${encodeURIComponent(slug)}&limit=20`;
    const response = await fetch(searchUrl, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to search events" },
        { status: 502 }
      );
    }

    const result = await response.json();
    const events = result?.data?.data || result?.data || [];

    // Generate slug from title: remove non-alphanumeric chars, uppercase
    const generateSlug = (title: string) =>
      title.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const normalizedSlug = slug.toUpperCase();

    // Find event whose slugified title matches the requested slug
    const matchedEvent = Array.isArray(events)
      ? events.find((event: any) => generateSlug(event.title) === normalizedSlug)
      : null;

    if (matchedEvent) {
      return NextResponse.json({
        found: true,
        eventId: matchedEvent.id,
        title: matchedEvent.title,
        slug: normalizedSlug,
      });
    }

    return NextResponse.json(
      { found: false, error: "No event matches this slug" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Slug lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
