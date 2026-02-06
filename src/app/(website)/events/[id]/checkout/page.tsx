"use client";

import { useParams } from "next/navigation";
import EventCheckoutPage from "@/components/Events/EventCheckoutPage";
import { Suspense } from "react";

const CheckoutPage = () => {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <EventCheckoutPage eventId={eventId || "1"} />
    </Suspense>
  );
};

export default CheckoutPage;

