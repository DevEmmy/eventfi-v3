const SHORT_DOMAIN = "https://eventfi.live";
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || (typeof window !== "undefined" ? window.location.origin : "https://eventfi.live");

/**
 * Build the best shareable URL for an event.
 * - If a DB slug exists → eventfi.live/[SLUG]
 * - Otherwise → [FRONTEND_URL]/events/[id]
 */
export const getEventShareUrl = (params: { slug?: string | null; id?: string }): string => {
  if (params.slug) {
    return `${SHORT_DOMAIN}/${params.slug}`;
  }
  if (params.id) {
    return `${FRONTEND_URL}/events/${params.id}`;
  }
  return FRONTEND_URL;
};

/**
 * @deprecated Pass { slug, id } object to getEventShareUrl instead.
 * Kept for any legacy callers — generates a slug from a title.
 */
export const generateEventSlug = (title: string): string => {
  return title.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
};
