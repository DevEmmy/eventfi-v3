"use client";

import { useParams } from "next/navigation";
import EventCheckoutPage from "@/components/Events/EventCheckoutPage";

const CheckoutPage = () => {
  const params = useParams();
  const eventId = params?.id as string;

  return <EventCheckoutPage eventId={eventId || "1"} />;
};

export default CheckoutPage;

