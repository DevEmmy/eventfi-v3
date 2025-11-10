"use client";

import { useParams } from "next/navigation";
import EventDetailPage from "@/components/EventDetail/EventDetailPage";

const page = () => {
  const params = useParams();
  const eventId = params?.id as string;

  return <EventDetailPage eventId={eventId || "1"} />;
};

export default page;

