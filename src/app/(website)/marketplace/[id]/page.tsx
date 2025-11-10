"use client";

import { useParams } from "next/navigation";
import VendorDetailPage from "@/components/Marketplace/VendorDetailPage";

const page = () => {
  const params = useParams();
  const vendorId = params?.id as string;

  return <VendorDetailPage vendorId={vendorId || "1"} />;
};

export default page;

