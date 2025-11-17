"use client";

import { useParams } from "next/navigation";
import EventReviewForm from "@/components/Events/EventReviewForm";

const ReviewEventPage = () => {
  const params = useParams();
  const eventId = params?.id as string;

  // Mock event data - Replace with API call
  const eventData = {
    eventId: eventId || "1",
    eventName: "Tech Fest Lagos 2024",
    eventDate: "March 15, 2024",
    eventLocation: "Lagos Convention Centre",
  };

  return <EventReviewForm {...eventData} />;
};

export default ReviewEventPage;

