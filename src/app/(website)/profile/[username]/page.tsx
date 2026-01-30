"use client";

import { useParams } from "next/navigation";
import UserProfile from "@/components/Profile/UserProfile";

const ProfilePage = () => {
  const params = useParams();
  const username = params?.username as string;

  // Check if this is the current user's profile
  // This would typically come from auth context
  const isOwnProfile = false; // Replace with actual auth check

  return <UserProfile username={username || ""} isOwnProfile={isOwnProfile} />;
};

export default ProfilePage;