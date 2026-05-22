import type { Metadata } from "next";
import EventDetailPage from "@/components/EventDetail/EventDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://eventfi-backend-v2.onrender.com/api/v1";

async function fetchEvent(id: string) {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEvent(id);

  if (!event) {
    return {
      title: "Event",
      description: "Discover and book amazing events on EventFi.",
    };
  }

  const title = event.title;
  const description = event.description
    ? event.description.slice(0, 160)
    : `Join us at ${event.title}. Book your tickets on EventFi.`;
  const image = event.coverImage || "https://eventfi.live/ogp.png";
  const url = event.slug
    ? `https://eventfi.live/${event.slug}`
    : `https://eventfi.live/events/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | EventFi`,
      description,
      url,
      siteName: "EventFi",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EventFi`,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const event = await fetchEvent(id);

  const url = event?.slug
    ? `https://eventfi.live/${event.slug}`
    : `https://eventfi.live/events/${id}`;

  const jsonLd = event
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description ?? undefined,
        image: event.coverImage ?? undefined,
        url,
        startDate: event.startDate ?? undefined,
        endDate: event.endDate ?? undefined,
        location: event.venue
          ? { "@type": "Place", name: event.venue, address: event.location ?? event.venue }
          : undefined,
        organizer: {
          "@type": "Organization",
          name: "EventFi",
          url: "https://eventfi.live",
        },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "NGN",
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <EventDetailPage eventId={id} />
    </>
  );
}
