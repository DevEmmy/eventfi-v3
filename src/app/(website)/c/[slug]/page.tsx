import type { Metadata } from "next";
import CommunityPage from "@/components/Communities/CommunityPage";

interface Props {
  params: Promise<{ slug: string }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://eventfi-backend-v2.onrender.com/api/v1";

async function fetchCommunity(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/communities/slug/${slug}`, {
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
  const community = await fetchCommunity(slug);

  if (!community) {
    return {
      title: "Community",
      description: "Discover communities and their events on EventFi.",
    };
  }

  const title = community.name;
  const description = community.description
    ? community.description.slice(0, 160)
    : `Discover upcoming events from ${community.name} on EventFi.`;
  const image = community.bannerImage || community.logo || "https://eventfi.live/ogp.png";
  const url = `https://eventfi.live/c/${community.slug}`;

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
  const community = await fetchCommunity(slug);

  const url = `https://eventfi.live/c/${slug}`;

  const jsonLd = community
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: community.name,
        description: community.description ?? undefined,
        image: community.logo || community.bannerImage || undefined,
        url,
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
      <CommunityPage slug={slug} initialData={community} />
    </>
  );
}
