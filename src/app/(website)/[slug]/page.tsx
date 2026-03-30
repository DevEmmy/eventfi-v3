"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EventService } from "@/services/events";

const ShortUrlPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const resolveSlug = async () => {
      const event = await EventService.getEventBySlug(slug);
      if (event) {
        router.replace(`/events/${event.id}`);
      } else {
        setNotFound(true);
      }
    };

    resolveSlug();
  }, [slug, router]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-4xl font-bold text-foreground">Event Not Found</h1>
        <p className="text-foreground/60 text-lg">
          No event matches the link <span className="font-mono text-primary">/{slug}</span>
        </p>
        <button
          onClick={() => router.push("/explore-events")}
          className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors mt-4"
        >
          Explore Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        <p className="text-foreground/60 text-sm">Finding your event...</p>
      </div>
    </div>
  );
};

export default ShortUrlPage;
