import type { Metadata } from "next";
import CommunityPage from "@/components/Community";

export const metadata: Metadata = {
  title: "Hub",
  description:
    "Join the EventFi hub. Connect with event organizers, vendors, and attendees. Share experiences and stay updated on events happening around you.",
  alternates: { canonical: "https://eventfi.live/hub" },
  openGraph: { url: "https://eventfi.live/hub" },
};

export default function Page() {
  return <CommunityPage />;
}
