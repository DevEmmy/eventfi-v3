import type { Metadata } from "next";
import SlugRedirectPage from "@/components/SlugRedirectPage";

interface Props {
  params: Promise<{ slug: string }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://eventfi-backend-v2.onrender.com/api/v1";

async function fetchEventBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/events/slug/${encodeURIComponent(slug.toUpperCase())}`, {
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
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

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
  const url = `https://eventfi.live/${slug}`;

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
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  const url = `https://eventfi.live/${slug}`;

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
      <SlugRedirectPage slug={slug} />
    </>
  );
}
