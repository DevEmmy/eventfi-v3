"use client";

import { useParams } from "next/navigation";
import EventManagePage from "@/components/Events/EventManagePage";

const ManageEventPage = () => {
  const params = useParams();
  const eventId = params?.id as string;

  return <EventManagePage eventId={eventId || "1"} />;
};

export default ManageEventPage;

