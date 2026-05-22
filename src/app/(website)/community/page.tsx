import type { Metadata } from "next";
import CommunityPage from "@/components/Community";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the EventFi community. Connect with event organizers, vendors, and attendees. Share experiences and stay updated on events happening around you.",
  alternates: { canonical: "https://eventfi.live/community" },
  openGraph: { url: "https://eventfi.live/community" },
};

export default function Page() {
  return <CommunityPage />;
}

