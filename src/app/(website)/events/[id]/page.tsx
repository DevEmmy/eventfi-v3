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
      title: "Event | EventFi",
      description: "Discover and book amazing events on EventFi.",
    };
  }

  const title = `${event.title} | EventFi`;
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
    openGraph: {
      title,
      description,
      url,
      siteName: "EventFi",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <EventDetailPage eventId={id} />;
}
