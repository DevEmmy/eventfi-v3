import type { Metadata } from "next";
import MarketplacePage from "@/components/Marketplace";

export const metadata: Metadata = {
  title: "Vendor Marketplace",
  description:
    "Find and book trusted event vendors on EventFi — photographers, caterers, decorators, DJs, and more. Verified professionals for your next event.",
  alternates: { canonical: "https://eventfi.live/marketplace" },
  openGraph: { url: "https://eventfi.live/marketplace" },
};

export default function Page() {
  return <MarketplacePage />;
}

