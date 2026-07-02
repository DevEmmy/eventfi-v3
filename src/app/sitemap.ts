import type { MetadataRoute } from "next";

const BASE_URL = "https://eventfi.live";
const API_BASE = "https://eventfi-backend-v2.onrender.com/api/v1";

async function fetchPublicEvents() {
  try {
    const res = await fetch(`${API_BASE}/events?page=1&limit=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    // API returns { data: { meta: {...}, data: [...] } }
    const items = json?.data?.data ?? json?.data ?? json?.events ?? [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

async function fetchPublicVendors() {
  try {
    const res = await fetch(`${API_BASE}/vendors?page=1&limit=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    // API returns { data: { meta: {...}, data: [...] } }
    const items = json?.data?.data ?? json?.data ?? json?.vendors ?? [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/explore-events`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hub`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const [events, vendors] = await Promise.all([
    fetchPublicEvents(),
    fetchPublicVendors(),
  ]);

  const eventRoutes: MetadataRoute.Sitemap = events
    .filter((e: { id?: string }) => e.id)
    .map((e: { id: string; slug?: string; updatedAt?: string }) => ({
      url: e.slug ? `${BASE_URL}/${e.slug}` : `${BASE_URL}/events/${e.id}`,
      lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  const vendorRoutes: MetadataRoute.Sitemap = vendors
    .filter((v: { id?: string }) => v.id)
    .map((v: { id: string; updatedAt?: string }) => ({
      url: `${BASE_URL}/marketplace/${v.id}`,
      lastModified: v.updatedAt ? new Date(v.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...eventRoutes, ...vendorRoutes];
}
