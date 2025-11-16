"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import QuickActions from "./QuickActions";
import MyEvents from "./MyEvents";
import MyTickets from "./MyTickets";
import VendorProfileSection from "./VendorProfileSection";
import SettingsSection from "./SettingsSection";
import DashboardContent from "./DashboardContent";
import { Calendar, Ticket, Shop, Setting2, Home2, Chart } from "iconsax-react";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";

interface MyProfileProps {
  // This would typically come from auth context
  userData?: {
    username: string;
    displayName: string;
    bio?: string;
    location?: string;
    avatar?: string;
    isVerified?: boolean;
    roles: string[];
    stats: {
      eventsHosted: number;
      eventsAttended: number;
      followers: number;
      following: number;
    };
  };
}

const MyProfile: React.FC<MyProfileProps> = ({ userData }) => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "overview");

  // Update active tab when URL param changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Mock user data - replace with actual auth context
  const currentUser = userData || {
    username: "alex-johnson",
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
  };

  const hasVendorProfile = true;
  const isOrganizer = currentUser.roles.some((role) => 
    role.toLowerCase().includes("organizer") || role.toLowerCase().includes("host")
  );

  // Mock events data
  const myEvents: EventCardProps[] = [
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
  ];

  // Mock tickets data
  const myTickets = [
    {
      id: "3",
      title: "Afro Nation Festival",
      date: "Mar 15, 2025",
      time: "4:00 PM",
      location: "Tafawa Balewa Square",
      price: "₦25,000",
      category: "Music",
      attendees: 5000,
      ticketId: "TKT-001",
      status: "upcoming" as const,
      purchaseDate: "Jan 10, 2025",
    },
    {
      id: "4",
      title: "DevFest Lagos 2024",
      date: "Dec 20, 2024",
      time: "9:00 AM",
      location: "Landmark Centre",
      price: "₦10,000",
      category: "Tech",
      attendees: 800,
      ticketId: "TKT-002",
      status: "past" as const,
      purchaseDate: "Nov 15, 2024",
    },
  ];

  const tabs: {
    id: string;
    label: string;
    icon: React.ComponentType<{
      size?: number;
      color?: string;
      variant?: "Linear" | "Outline" | "Bold" | "Broken" | "Bulk" | "TwoTone";
    }>;
    count?: number;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: Home2,
    },
  ];

  // Add Dashboard tab for organizers
  if (isOrganizer) {
    tabs.push({
      id: "dashboard",
      label: "Dashboard",
      icon: Chart,
    });
  }

  tabs.push(
    {
      id: "events",
      label: "My Events",
      icon: Calendar,
      count: myEvents.length,
    },
    {
      id: "tickets",
      label: "My Tickets",
      icon: Ticket,
      count: myTickets.filter((t) => t.status === "upcoming").length,
    }
  );

  // Add vendor tab if user has vendor profile or can create one
  if (hasVendorProfile || isOrganizer) {
    tabs.push({
      id: "vendor",
      label: "Vendor Profile",
      icon: Shop,
    });
  }

  // Add settings tab
  tabs.push({
    id: "settings",
    label: "Settings",
    icon: Setting2,
  });

  const handleCreateEvent = () => {
    // Navigate to event creation page
    window.location.href = "/events/create";
  };

  const handleCreateVendor = () => {
    // Navigate to vendor creation page
    window.location.href = "/vendor/create";
  };

  const handleEditVendor = () => {
    // Navigate to vendor edit page
    window.location.href = "/vendor/edit";
  };

  const handleViewVendor = () => {
    // Navigate to public vendor profile
    window.location.href = `/marketplace/vendor-profile`;
  };

  const handleViewTickets = () => {
    setActiveTab("tickets");
  };

  const handleEditProfile = () => {
    // Navigate to profile edit page
    window.location.href = "/profile/edit";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <QuickActions
              userRoles={currentUser.roles}
              onCreateEvent={handleCreateEvent}
              onCreateVendor={handleCreateVendor}
              onViewTickets={handleViewTickets}
            />
            {isOrganizer && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  Recent Events
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {myEvents.slice(0, 4).map((event) => (
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
              </div>
            )}
          </div>
        );

      case "dashboard":
        return <DashboardContent events={myEvents} />;

      case "events":
        return (
          <MyEvents events={myEvents} onCreateEvent={handleCreateEvent} />
        );

      case "tickets":
        return <MyTickets tickets={myTickets} />;

      case "vendor":
        return (
          <VendorProfileSection
            hasVendorProfile={hasVendorProfile}
            vendorData={
              hasVendorProfile
                ? {
                    name: "Alex Photography",
                    category: "Photography",
                    rating: 4.8,
                    reviews: 124,
                    isVerified: true,
                    description: "Professional event photography services with 5+ years of experience. We specialize in capturing life's most precious moments at weddings, corporate events, and special occasions. Our team of skilled photographers uses state-of-the-art equipment to deliver stunning, high-quality images that tell your story beautifully.",
                    location: "Lagos, Nigeria",
                    address: "123 Victoria Island, Lagos",
                    phone: "+234 800 123 4567",
                    email: "contact@alexphotography.com",
                    website: "https://www.alexphotography.com",
                    priceRange: "₦50,000 - ₦200,000",
                    specialties: ["Wedding Photography", "Corporate Events", "Portrait Sessions", "Event Coverage"],
                    yearsOfExperience: "5",
                    availability: "available" as const,
                    coverImage: undefined,
                    logo: undefined,
                    portfolio: [],
                  }
                : undefined
            }
            onCreateVendor={handleCreateVendor}
            onEditVendor={handleEditVendor}
            onViewVendor={handleViewVendor}
          />
        );

      case "settings":
        return <SettingsSection />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ProfileHeader
        username={currentUser.username}
        displayName={currentUser.displayName}
        bio={currentUser.bio}
        location={currentUser.location}
        avatar={currentUser.avatar}
        isVerified={currentUser.isVerified}
        isOwnProfile={true}
        roles={currentUser.roles}
        stats={currentUser.stats}
        onEdit={handleEditProfile}
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

export default MyProfile;

