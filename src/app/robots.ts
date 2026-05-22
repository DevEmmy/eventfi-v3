import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth/",
          "/onboarding/",
          "/api/",
          "/events/*/checkout",
          "/events/*/edit",
          "/events/*/manage",
          "/events/*/import",
          "/events/*/review",
          "/events/create",
          "/vendor/create",
          "/vendor/edit",
          "/profile/edit",
          "/settings/",
          "/team/accept",
          "/marketplace/*/book",
          "/messages/",
          "/notifications/",
        ],
      },
    ],
    sitemap: "https://eventfi.live/sitemap.xml",
  };
}
