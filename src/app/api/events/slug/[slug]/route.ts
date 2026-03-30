import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * GET /api/events/slug/[slug]
 * Looks up an event by its slug field stored in the database.
 * Queries the backend directly: GET /events/slug/:slug
 * Falls back to search-based matching if direct slug endpoint doesn't exist.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 }
    );
  }

  const normalizedSlug = slug.toUpperCase();

  try {
    // Approach 1: Try direct slug lookup endpoint
    const slugUrl = `${API_BASE_URL}/events/slug/${encodeURIComponent(normalizedSlug)}`;
    const directRes = await fetch(slugUrl, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (directRes.ok) {
      const result = await directRes.json();
      const event = result?.data || result;

      if (event?.id) {
        return NextResponse.json({
          found: true,
          eventId: event.id,
          title: event.title,
          slug: normalizedSlug,
        });
      }
    }

    // Approach 2: Fallback — search events and match slug against titles
    const searchUrl = `${API_BASE_URL}/events?search=${encodeURIComponent(normalizedSlug)}&limit=20`;
    const searchRes = await fetch(searchUrl, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (searchRes.ok) {
      const result = await searchRes.json();
      const events = result?.data?.data || result?.data || [];

      const generateSlug = (title: string) =>
        title.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

      const matchedEvent = Array.isArray(events)
        ? events.find((event: any) => {
            // Match by slug field or by generated slug from title
            const eventSlug = event.slug || generateSlug(event.title);
            return eventSlug === normalizedSlug;
          })
        : null;

      if (matchedEvent) {
        return NextResponse.json({
          found: true,
          eventId: matchedEvent.id,
          title: matchedEvent.title,
          slug: normalizedSlug,
        });
      }
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
