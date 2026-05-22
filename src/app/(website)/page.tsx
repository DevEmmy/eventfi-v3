import type { Metadata } from "next";
import Homepage from "@/components/Homepage";

export const metadata: Metadata = {
  title: { absolute: "EventFi — All-in-One Event Platform" },
  description:
    "Discover, create, and book amazing events across Nigeria. Connect with trusted vendors and experience live engagement on EventFi.",
  alternates: { canonical: "https://eventfi.live" },
  openGraph: {
    url: "https://eventfi.live",
    type: "website",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EventFi",
    url: "https://eventfi.live",
    logo: "https://eventfi.live/ogp.png",
    description:
      "The all-in-one platform for seamless events, trusted vendors, and live engagement.",
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Homepage />
    </>
  );
}
