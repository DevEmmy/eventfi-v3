"use client";

import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import { Calendar, User, TickCircle } from "iconsax-react";

interface UserProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  isOwnProfile = false,
}) => {
  const [activeTab, setActiveTab] = useState("events");

  // Mock data - replace with actual API calls
  const profileData = {
    username: username,
    displayName: "Alex Johnson",
    bio: "Event organizer passionate about bringing communities together. Hosting tech meetups, conferences, and networking events across Lagos.",
    location: "Lagos, Nigeria",
    avatar: undefined,
    isVerified: true,
    roles: ["Organizer", "Community Builder"],
    stats: {
      eventsHosted: 24,
      eventsAttended: 156,
      followers: 1240,
      following: 342,
    },
    isFollowing: false,
  };

  const tabs = [
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      count: 24,
    },
    {
      id: "following",
      label: "Following",
      icon: TickCircle,
      count: profileData.stats.following,
    },
    {
      id: "followers",
      label: "Followers",
      icon: User,
      count: profileData.stats.followers,
    },
  ];

  // Mock events data
  const hostedEvents: EventCardProps[] = [
    {
      id: "1",
      title: "Tech Meetup Lagos - January Edition",
      date: "Jan 25, 2025",
      time: "6:00 PM",
      location: "Lagos Tech Hub",
      price: "Free",
      category: "Tech",
      attendees: 120,
    },
    {
      id: "2",
      title: "Design Conference 2025",
      date: "Feb 10, 2025",
      time: "9:00 AM",
      location: "Eko Hotel & Suites",
      price: "₦15,000",
      category: "Design",
      attendees: 450,
    },
    {
      id: "3",
      title: "Startup Networking Night",
      date: "Feb 20, 2025",
      time: "7:00 PM",
      location: "The Foundry",
      price: "₦5,000",
      category: "Networking",
      attendees: 80,
    },
    {
      id: "4",
      title: "Developer Workshop: Next.js",
      date: "Mar 5, 2025",
      time: "10:00 AM",
      location: "Online",
      price: "Free",
      category: "Workshop",
      attendees: 200,
    },
  ];

  const handleFollow = () => {
    // Handle follow/unfollow logic
    console.log("Follow/Unfollow clicked");
  };

  const handleEdit = () => {
    // Handle edit profile
    console.log("Edit profile clicked");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "events":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hostedEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  window.location.href = `/events/${event.id}`;
                }}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>
        );

      case "following":
        return (
          <div className="py-12 text-center">
            <p className="text-foreground/60">
              Following list will be displayed here
            </p>
          </div>
        );

      case "followers":
        return (
          <div className="py-12 text-center">
            <p className="text-foreground/60">
              Followers list will be displayed here
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ProfileHeader
        username={profileData.username}
        displayName={profileData.displayName}
        bio={profileData.bio}
        location={profileData.location}
        avatar={profileData.avatar}
        isVerified={profileData.isVerified}
        isOwnProfile={isOwnProfile}
        isFollowing={profileData.isFollowing}
        roles={profileData.roles}
        stats={profileData.stats}
        onFollow={handleFollow}
        onEdit={handleEdit}
      />

      {/* Tabs */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default UserProfile;

