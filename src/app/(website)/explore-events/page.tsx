import type { Metadata } from "next";
import ExploreEventsPage from "@/components/ExploreEvents";

export const metadata: Metadata = {
  title: "Explore Events",
  description:
    "Browse and discover upcoming events near you. Filter by category, date, and location. Book your tickets on EventFi.",
  alternates: { canonical: "https://eventfi.live/explore-events" },
  openGraph: { url: "https://eventfi.live/explore-events" },
};

export default function Page() {
  return <ExploreEventsPage />;
}