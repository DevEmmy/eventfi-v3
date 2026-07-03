import type { Metadata } from "next";
import CommunitiesDirectory from "@/components/Communities/CommunitiesDirectory";

export const metadata: Metadata = {
  title: "Discover Communities",
  description:
    "Browse and follow event communities on EventFi — find organizers and chapters hosting events near you.",
  alternates: { canonical: "https://eventfi.live/communities" },
  openGraph: { url: "https://eventfi.live/communities" },
};

export default function Page() {
  return <CommunitiesDirectory />;
}
