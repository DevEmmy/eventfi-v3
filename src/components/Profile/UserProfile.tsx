"use client";

import React, { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import { Calendar, User, TickCircle } from "iconsax-react";
import { UserService } from "@/services/user";
import { EventService } from "@/services/events";
import { useUserStore } from "@/store/useUserStore";

interface UserProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  location?: string;
  avatar?: string;
  isVerified: boolean;
  roles: string[];
  stats: {
    eventsHosted: number;
    eventsAttended: number;
    followers: number;
    following: number;
  };
  isFollowing?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  isOwnProfile = false,
}) => {
  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [hostedEvents, setHostedEvents] = useState<EventCardProps[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const { user: currentUser } = useUserStore();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await UserService.getProfileByUsername(username);

        setProfileData({
          id: profile.id,
          username: profile.username || username,
          displayName: profile.displayName || username,
          bio: profile.bio || "",
          location: profile.location || "",
          avatar: profile.avatar || undefined,
          isVerified: profile.isVerified || false,
          roles: profile.roles || ["attendee"],
          stats: profile.stats || {
            eventsHosted: 0,
            eventsAttended: 0,
            followers: 0,
            following: 0,
          },
          isFollowing: profile.isFollowing || false,
        });
        setIsFollowing(profile.isFollowing || false);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Fetch user's hosted events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!profileData?.id) return;

      try {
        setEventsLoading(true);
        // Fetch events by organizer ID
        const response = await EventService.getEvents({ organizerId: profileData.id, limit: 12 });

        const mappedEvents = response.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: `${event.startTime} - ${event.endTime}`,
          location: event.venueName || event.city || "Online",
          price: event.tickets && event.tickets.length > 0
            ? (event.tickets[0].type === 'FREE' ? 'Free' : `₦${event.tickets[0].price.toLocaleString()}`)
            : "Free",
          category: event.category,
          attendees: event.attendeesCount || 0,
          image: event.coverImage,
        }));

        setHostedEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, [profileData?.id]);

  const tabs = [
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      count: profileData?.stats.eventsHosted || 0,
    },
    {
      id: "following",
      label: "Following",
      icon: TickCircle,
      count: profileData?.stats.following || 0,
    },
    {
      id: "followers",
      label: "Followers",
      icon: User,
      count: profileData?.stats.followers || 0,
    },
  ];

  const handleFollow = async () => {
    if (!profileData?.id || followLoading) return;

    try {
      setFollowLoading(true);
      if (isFollowing) {
        await UserService.unfollowUser(profileData.id);
        setIsFollowing(false);
        setProfileData(prev => prev ? {
          ...prev,
          stats: { ...prev.stats, followers: prev.stats.followers - 1 }
        } : null);
      } else {
        await UserService.followUser(profileData.id);
        setIsFollowing(true);
        setProfileData(prev => prev ? {
          ...prev,
          stats: { ...prev.stats, followers: prev.stats.followers + 1 }
        } : null);
      }
    } catch (err) {
      console.error("Failed to follow/unfollow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleEdit = () => {
    window.location.href = "/profile/edit";
  };

  // Check if viewing own profile
  const viewingOwnProfile = isOwnProfile || (currentUser?.username === username);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h2>
          <p className="text-foreground/60">{error || "This user doesn't exist."}</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "events":
        if (eventsLoading) {
          return (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          );
        }

        if (hostedEvents.length === 0) {
          return (
            <div className="py-12 text-center">
              <p className="text-foreground/60">No events hosted yet</p>
            </div>
          );
        }

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
        isOwnProfile={viewingOwnProfile}
        isFollowing={isFollowing}
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
