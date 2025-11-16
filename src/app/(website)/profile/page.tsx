"use client";

import MyProfile from "@/components/Profile/MyProfile";

const ProfilePage = () => {
  // This would typically fetch user data from auth context
  // For now, we'll pass undefined and let the component use mock data
  return <MyProfile />;
};

export default ProfilePage;

