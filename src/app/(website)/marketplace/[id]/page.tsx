import type { Metadata } from "next";
import VendorDetailPage from "@/components/Marketplace/VendorDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://eventfi-backend-v2.onrender.com/api/v1";

async function fetchVendor(id: string) {
  try {
    const res = await fetch(`${API_BASE}/vendors/${id}`, {
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
  const vendor = await fetchVendor(id);

  if (!vendor) {
    return {
      title: "Vendor",
      description: "Browse trusted event vendors on EventFi Marketplace.",
    };
  }

  const title = vendor.name;
  const description = vendor.description
    ? vendor.description.slice(0, 160)
    : `Book ${vendor.name} for your next event on EventFi Marketplace.`;
  const image = vendor.coverImage || vendor.logo || "https://eventfi.live/ogp.png";
  const url = `https://eventfi.live/marketplace/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | EventFi Marketplace`,
      description,
      url,
      siteName: "EventFi",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EventFi Marketplace`,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <VendorDetailPage vendorId={id} />;
}
