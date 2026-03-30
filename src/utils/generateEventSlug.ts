/**
 * Generates a short URL slug from an event title.
 * Removes all non-alphanumeric characters and converts to uppercase.
 *
 * Examples:
 *   "Dev Fest 2025"       → "DEVFEST2025"
 *   "Tech & Music Night"  → "TECHMUSICNIGHT"
 *   "Lagos Meet-Up #3"    → "LAGOSMEETUP3"
 */
export const generateEventSlug = (title: string): string => {
  return title.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
};
