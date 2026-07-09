"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import QuickActions from "./QuickActions";
import MyEvents, { MyEventItem } from "./MyEvents";
import MyTickets from "./MyTickets";
import PaymentPlans from "./PaymentPlans";
import VendorProfileSection from "./VendorProfileSection";
import SettingsSection from "./SettingsSection";
import DashboardContent from "./DashboardContent";
import VendorDashboardContent from "./VendorDashboardContent";
import SavedEvents from "./SavedEvents";
import { CalendarBlank, Ticket, Storefront, Gear, House, ChartBar, Heart, Wallet, UsersThree } from '@phosphor-icons/react';
import PayoutPage from "@/components/Organizer/PayoutPage";
import EventCard from "@/components/Homepage/EventCard";
import MyCommunities from "@/components/Communities/MyCommunities";
import { useUserStore } from "@/store/useUserStore";
import { getTicketPriceInfo } from "@/utils/ticket-pricing";
import { CommunityService } from "@/services/community";
import { MyCommunity } from "@/types/community";
import { BookingService } from "@/services/booking";
import { BookingOrder } from "@/types/booking";

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
  // Any logged-in user can create events and act as an organizer.
  // The onboarding role selection doesn't persist to the API, so role-gating
  // these tabs would hide them from most users. Show them to everyone.
  const isOrganizer = true;

  // State for events, tickets, and dashboard
  const [myEvents, setMyEvents] = useState<MyEventItem[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<import("@/services/events").OrganizerDashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [myCommunities, setMyCommunities] = useState<MyCommunity[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [installmentOrders, setInstallmentOrders] = useState<BookingOrder[]>([]);
  const [installmentOrdersLoading, setInstallmentOrdersLoading] = useState(true);

  // Fetch user's events
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setEventsLoading(true);
        const { UserService } = await import("@/services/user");
        const response = await UserService.getUserEvents({ limit: 10 });

        const mappedEvents = response.data.map((event: any) => {
          const { label, count } = getTicketPriceInfo(event.tickets);
          return {
            id: event.id,
            title: event.title,
            slug: event.slug || undefined,
            date: new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: `${event.startTime} - ${event.endTime}`,
            locationType: event.locationType as "ONLINE" | "PHYSICAL" | "HYBRID",
            location: event.locationType === 'ONLINE'
              ? 'Online'
              : (event.venueName || event.city || 'TBD'),
            price: label,
            ticketCount: count,
            category: event.category,
            attendees: event.attendeesCount || 0,
            image: event.coverImage,
            // userRole is 'organizer' for own events, or the team role for invited events
            userRole: event.userRole !== 'organizer' ? event.userRole : undefined,
          };
        });

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
          slug: undefined,
          date: new Date(ticket.event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: 'TBA',
          locationType: undefined as "ONLINE" | "PHYSICAL" | "HYBRID" | undefined,
          location: ticket.event.venueName || ticket.event.city || 'TBD',
          // ticketType from the API is { name, type } — extract the name string
          price: (ticket.ticketType?.name ?? ticket.ticketType) || 'Standard',
          category: 'Event',
          attendees: 0,
          image: ticket.event.coverImage,
          ticketId: ticket.id,
          status: new Date(ticket.event.startDate) > new Date() ? "upcoming" : "past",
          // backend field is purchasedAt, not purchaseDate
          purchaseDate: ticket.purchasedAt
            ? new Date(ticket.purchasedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '',
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

  // Fetch orders with an installment plan (pending or past — not just confirmed tickets)
  useEffect(() => {
    const fetchInstallmentOrders = async () => {
      try {
        setInstallmentOrdersLoading(true);
        const response = await BookingService.getUserOrders({ limit: 20 });
        setInstallmentOrders(response.data.filter((o) => !!o.installmentPlan));
      } catch (error) {
        console.error("Failed to fetch installment orders:", error);
      } finally {
        setInstallmentOrdersLoading(false);
      }
    };

    if (user || userData) {
      fetchInstallmentOrders();
    }
  }, [user, userData]);

  // Fetch organizer dashboard data when dashboard tab is active
  useEffect(() => {
    if (activeTab !== "dashboard") return;
    if (dashboardData) return;

    const fetchDashboard = async () => {
      try {
        setDashboardLoading(true);
        const { EventService } = await import("@/services/events");
        const data = await EventService.getOrganizerDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboard();
  }, [activeTab, dashboardData]);

  // Fetch communities when the communities tab is active
  useEffect(() => {
    if (activeTab !== "communities") return;

    const fetchCommunities = async () => {
      try {
        setCommunitiesLoading(true);
        const data = await CommunityService.listMine();
        setMyCommunities(data);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      } finally {
        setCommunitiesLoading(false);
      }
    };

    fetchCommunities();
  }, [activeTab]);

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
        icon: House,
      },
    ];

  // Add Dashboard and Payouts tabs for organizers
  if (isOrganizer) {
    tabs.push({
      id: "dashboard",
      label: "Organizer Dashboard",
      icon: ChartBar,
    });
    tabs.push({
      id: "payouts",
      label: "Payouts",
      icon: Wallet,
    });
  }

  // Add Vendor Dashboard tab for vendors
  if (hasVendorProfile) {
    tabs.push({
      id: "vendor-dashboard",
      label: "Vendor Dashboard",
      icon: Storefront,
    });
  }

  tabs.push(
    {
      id: "events",
      label: "My Events",
      icon: CalendarBlank,
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
    },
    {
      id: "communities",
      label: "Communities",
      icon: UsersThree,
    }
  );

  if (installmentOrders.length > 0) {
    tabs.push({
      id: "payments",
      label: "Payment Plans",
      icon: Wallet,
      count: installmentOrders.filter((o) => o.installmentPlan?.status === "active").length,
    });
  }

  // Add vendor tab if user has vendor profile or can create one
  // if (hasVendorProfile || isOrganizer) {
  //   tabs.push({
  //     id: "vendor",
  //     label: "Vendor Profile",
  //     icon: Storefront,
  //   });
  // }

  // Add settings tab
  tabs.push({
    id: "settings",
    label: "Settings",
    icon: Gear,
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
                      <ChartBar size={24} color="currentColor" weight="fill" className="text-primary" />
                      <Storefront size={24} color="currentColor" weight="fill" className="text-secondary" />
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
                      <ChartBar size={20} color="currentColor" weight="fill" className="text-primary" />
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
                      <Storefront size={20} color="currentColor" weight="fill" className="text-secondary" />
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
                  {myEvents.slice(0, 4).map((event) => {
                    const roleLabels: Record<string, string> = { "co-host": "Co-host", manager: "Manager", assistant: "Assistant" };
                    const roleLabel = event.userRole ? roleLabels[event.userRole] : null;
                    return (
                      <div
                        key={event.id}
                        className="relative"
                        onClick={() => { window.location.href = `/events/${event.id}`; }}
                      >
                        <EventCard {...event} />
                        {roleLabel && (
                          <div className="absolute top-2 left-2 pointer-events-none">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary/90 text-secondary-foreground backdrop-blur-sm">
                              {roleLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
        if (dashboardLoading) {
          return (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
            </div>
          );
        }
        if (dashboardData) {
          return <DashboardContent data={dashboardData} />;
        }
        return (
          <div className="text-center py-16 text-foreground/60">
            Failed to load dashboard data.
          </div>
        );

      case "vendor-dashboard":
        return <VendorDashboardContent />;

      case "payouts":
        return <PayoutPage />;

      case "events":
        return (
          <MyEvents events={myEvents} onCreateEvent={handleCreateEvent} />
        );

      case "tickets":
        return <MyTickets tickets={myTickets} />;

      case "payments":
        return <PaymentPlans orders={installmentOrders} loading={installmentOrdersLoading} />;

      case "saved":
        return <SavedEvents />;

      case "communities":
        if (communitiesLoading) {
          return (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
            </div>
          );
        }
        return (
          <MyCommunities
            communities={myCommunities}
            onCreateCommunity={() => { window.location.href = "/communities/new"; }}
          />
        );

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

