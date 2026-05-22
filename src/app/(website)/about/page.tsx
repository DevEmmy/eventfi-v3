import type { Metadata } from "next";
import AboutPage from "@/components/About/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about EventFi — the all-in-one platform built to make event creation, vendor booking, and live audience engagement seamless across Nigeria.",
  alternates: { canonical: "https://eventfi.live/about" },
  openGraph: { url: "https://eventfi.live/about" },
};

export default function Page() {
  return <AboutPage />;
}

