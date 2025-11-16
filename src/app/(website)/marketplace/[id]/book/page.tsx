"use client";

import { useParams } from "next/navigation";
import VendorBookingPage from "@/components/Marketplace/VendorBookingPage";

const BookVendorPage = () => {
  const params = useParams();
  const vendorId = params?.id as string;

  return <VendorBookingPage vendorId={vendorId || "1"} />;
};

export default BookVendorPage;

