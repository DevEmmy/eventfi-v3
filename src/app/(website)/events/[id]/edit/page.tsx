"use client";

import { useParams } from "next/navigation";
import EditEventPage from "@/components/Events/EditEventPage";

const EditEventPageRoute = () => {
  const params = useParams();
  const eventId = params?.id as string;

  return <EditEventPage eventId={eventId || "1"} />;
};

export default EditEventPageRoute;

