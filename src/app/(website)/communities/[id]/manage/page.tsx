"use client";

import { useParams } from "next/navigation";
import CommunityManagePage from "@/components/Communities/CommunityManagePage";

const ManageCommunityPage = () => {
  const params = useParams();
  const communityId = params?.id as string;

  return <CommunityManagePage communityId={communityId} />;
};

export default ManageCommunityPage;
