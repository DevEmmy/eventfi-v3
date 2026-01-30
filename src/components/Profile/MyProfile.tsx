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
import VendorDashboardContent from "./VendorDashboardContent";
import SavedEvents from "./SavedEvents";
import { Calendar, Ticket, Shop, Setting2, Home2, Chart, Heart } from "iconsax-react";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import { useUserStore } from "@/store/useUserStore";

interface MyProfileProps {
  // Optional prop to override user data (for testing or server-side)
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

  // Get user from store
  const { user, loading, fetchUser } = useUserStore();

  // Fetch user on mount if not available
  useEffect(() => {
    if (!user && !userData) {
      fetchUser();
    }
  }, [user, userData, fetchUser]);

  // Update active tab when URL param changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Show loading state
  if (loading && !user && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Build current user from store or fallback
  const currentUser = userData || {
    username: user?.username || "user",
    displayName: user?.displayName || "User",
    bio: user?.bio || "",
    location: user?.location || "",
    avatar: user?.avatar || undefined,
    isVerified: user?.isVerified || false,
    roles: user?.roles || ["attendee"],
    stats: user?.stats || {
      eventsHosted: 0,
      eventsAttended: 0,
      followers: 0,
      following: 0,
    },
  };

  const hasVendorProfile = currentUser.roles.some((role) =>
    role.toLowerCase().includes("vendor")
  );
  const isOrganizer = currentUser.roles.some((role) =>
    role.toLowerCase().includes("organizer") || role.toLowerCase().includes("host")
  );

  // State for events and tickets
  const [myEvents, setMyEvents] = useState<EventCardProps[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  // Fetch user's events
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setEventsLoading(true);
        const { UserService } = await import("@/services/user");
        const response = await UserService.getUserEvents({ limit: 10 });

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

        setMyEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to fetch user events:", error);
      } finally {
        setEventsLoading(false);
      }
    };

    if (user || userData) {
      fetchUserEvents();
    }
  }, [user, userData]);

  // Fetch user's tickets
  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setTicketsLoading(true);
        const { UserService } = await import("@/services/user");
        const response = await UserService.getUserTickets({ limit: 20 });

        const mappedTickets = response.data.map((ticket: any) => ({
          id: ticket.event.id,
          title: ticket.event.title,
          date: new Date(ticket.event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: `${ticket.event.startTime} - ${ticket.event.endTime}`,
          location: ticket.event.venueName || ticket.event.city || "Online",
          price: ticket.ticketName || "Standard",
          category: ticket.event.category,
          attendees: 0,
          image: ticket.event.coverImage,
          ticketId: ticket.id,
          status: new Date(ticket.event.startDate) > new Date() ? "upcoming" : "past",
          purchaseDate: new Date(ticket.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }));

        setMyTickets(mappedTickets);
      } catch (error) {
        console.error("Failed to fetch user tickets:", error);
      } finally {
        setTicketsLoading(false);
      }
    };

    if (user || userData) {
      fetchUserTickets();
    }
  }, [user, userData]);

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
      label: "Organizer Dashboard",
      icon: Chart,
    });
  }

  // Add Vendor Dashboard tab for vendors
  if (hasVendorProfile) {
    tabs.push({
      id: "vendor-dashboard",
      label: "Vendor Dashboard",
      icon: Shop,
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
    },
    {
      id: "saved",
      label: "Saved Events",
      icon: Heart,
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

            {/* Dual Role Banner - Show if user is both organizer and vendor */}
            {isOrganizer && hasVendorProfile && (
              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Chart size={24} color="currentColor" variant="Bold" className="text-primary" />
                      <Shop size={24} color="currentColor" variant="Bold" className="text-secondary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-1">
                      You're Both an Organizer & Vendor! 🎉
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Manage your events and vendor services from one place. Switch between dashboards to see insights for each role.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-foreground/10 hover:border-primary transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Chart size={20} color="currentColor" variant="Bold" className="text-primary" />
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        Organizer Dashboard
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60">
                      View event statistics, attendees, and revenue
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab("vendor-dashboard")}
                    className="p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-foreground/10 hover:border-secondary transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Shop size={20} color="currentColor" variant="Bold" className="text-secondary" />
                      <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                        Vendor Dashboard
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60">
                      Track bookings, reviews, and service performance
                    </p>
                  </button>
                </div>
              </div>
            )}

            {isOrganizer && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                    Recent Events
                  </h3>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="text-sm text-primary hover:underline"
                  >
                    View Dashboard →
                  </button>
                </div>
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

            {hasVendorProfile && !isOrganizer && (
              <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                    Vendor Performance
                  </h3>
                  <button
                    onClick={() => setActiveTab("vendor-dashboard")}
                    className="text-sm text-primary hover:underline"
                  >
                    View Dashboard →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-foreground/5 rounded-xl">
                    <div className="text-2xl font-bold text-primary mb-1">48</div>
                    <div className="text-xs text-foreground/60">Total Bookings</div>
                  </div>
                  <div className="text-center p-4 bg-foreground/5 rounded-xl">
                    <div className="text-2xl font-bold text-secondary mb-1">₦3.2M</div>
                    <div className="text-xs text-foreground/60">Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-foreground/5 rounded-xl">
                    <div className="text-2xl font-bold text-accent mb-1">4.8</div>
                    <div className="text-xs text-foreground/60">Rating</div>
                  </div>
                  <div className="text-center p-4 bg-foreground/5 rounded-xl">
                    <div className="text-2xl font-bold text-primary mb-1">94%</div>
                    <div className="text-xs text-foreground/60">Response Rate</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "dashboard":
        return <DashboardContent events={myEvents} />;

      case "vendor-dashboard":
        return <VendorDashboardContent />;

      case "events":
        return (
          <MyEvents events={myEvents} onCreateEvent={handleCreateEvent} />
        );

      case "tickets":
        return <MyTickets tickets={myTickets} />;

      case "saved":
        return <SavedEvents />;

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

