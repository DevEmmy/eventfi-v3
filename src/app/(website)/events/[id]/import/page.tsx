"use client";

import { useParams } from "next/navigation";
import ImportAttendeesPage from "@/components/Events/ImportAttendeesPage";

const ImportPage = () => {
  const params = useParams();
  const eventId = params?.id as string;

  return <ImportAttendeesPage eventId={eventId} />;
};

export default ImportPage;
