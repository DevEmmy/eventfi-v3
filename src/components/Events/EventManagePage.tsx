"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import {
  ArrowLeft2,
  Calendar,
  Location,
  Clock,
  People,
  Ticket,
  MoneyRecive,
  Chart,
  Edit2,
  Trash,
  Share,
  Copy,
  More,
  ArrowUp2,
  ArrowDown2,
  User,
  Sms,
  Call,
  Export,
  Eye,
  Add,
  SearchNormal,
  CloseCircle,
  Profile2User,
  Send2,
  DocumentText,
  TickCircle,
} from "iconsax-react";
import { ManageEventService } from "@/services/manage";
import customToast from "@/lib/toast";
import {
  ManageDashboardResponse,
  AnalyticsResponse,
  EventAttendee,
  TeamMember,
  TeamRole,
  UserSearchResult,
  TicketSalesBreakdown,
  EventStats,
  SalesDataPoint,
} from "@/types/manage";

interface EventManagePageProps {
  eventId: string;
}

// Permission configurations for each role
const ROLE_PERMISSIONS: Record<Exclude<TeamRole, "organizer">, TeamMember["permissions"]> = {
  "co-host": {
    canEdit: true,
    canManageAttendees: true,
    canViewAnalytics: true,
    canManageTeam: false,
  },
  manager: {
    canEdit: false,
    canManageAttendees: true,
    canViewAnalytics: true,
    canManageTeam: false,
  },
  assistant: {
    canEdit: false,
    canManageAttendees: false,
    canViewAnalytics: false,
    canManageTeam: false,
  },
};

const EventManagePage: React.FC<EventManagePageProps> = ({ eventId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "attendees" | "analytics" | "team">("overview");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<Exclude<TeamRole, "organizer">>("co-host");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Dashboard data from API
  const [dashboardData, setDashboardData] = useState<ManageDashboardResponse | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);

  // Bulk email state
  const [emailRecipients, setEmailRecipients] = useState<"all" | "checked_in" | "not_checked_in" | "custom">("all");
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Attendees filter state
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "checked_in" | "not_checked_in">("all");
  const [filterTicketType, setFilterTicketType] = useState<string>("all");
  const [attendeesPage, setAttendeesPage] = useState(1);

  // Attendees data from API
  const [attendeesList, setAttendeesList] = useState<EventAttendee[]>([]);
  const [attendeesTotal, setAttendeesTotal] = useState(0);
  const [attendeesTotalPages, setAttendesTotalPages] = useState(1);

  // Team members from API
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // User search results
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);

  // Derived data from dashboard
  const event = dashboardData?.event;
  const stats = dashboardData?.stats || {
    totalTickets: 0,
    ticketsSold: 0,
    ticketsRemaining: 0,
    totalRevenue: 0,
    averageTicketPrice: 0,
    attendanceRate: 0,
    checkIns: 0,
    noShows: 0,
    refunds: 0,
    revenueChange: 0,
    salesChange: 0,
  };
  const ticketTypes = dashboardData?.ticketBreakdown || [];
  const userRole = dashboardData?.userRole || "assistant";
  const salesData = analyticsData?.salesOverTime || [];

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await ManageEventService.getDashboard(eventId);
        setDashboardData(data);
      } catch (error: any) {
        console.error("Failed to fetch dashboard:", error);
        customToast.error(error.response?.data?.message || "Failed to load event data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [eventId]);

  // Fetch team members
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await ManageEventService.getTeamMembers(eventId);
        setTeamMembers(data.members);
      } catch (error) {
        console.error("Failed to fetch team:", error);
      }
    };
    if (dashboardData) {
      fetchTeam();
    }
  }, [eventId, dashboardData]);

  // Fetch attendees when tab changes or filters change
  const fetchAttendees = useCallback(async () => {
    try {
      setAttendeesLoading(true);
      const data = await ManageEventService.getAttendees(eventId, {
        page: attendeesPage,
        limit: 20,
        search: attendeeSearchQuery || undefined,
        status: filterStatus === "all" ? undefined : filterStatus,
        ticketType: filterTicketType === "all" ? undefined : filterTicketType,
      });
      setAttendeesList(data.attendees);
      setAttendeesTotal(data.total);
      setAttendesTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch attendees:", error);
    } finally {
      setAttendeesLoading(false);
    }
  }, [eventId, attendeesPage, attendeeSearchQuery, filterStatus, filterTicketType]);

  useEffect(() => {
    if (activeTab === "attendees" && dashboardData) {
      fetchAttendees();
    }
  }, [activeTab, dashboardData, fetchAttendees]);

  // Fetch analytics when tab changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        const data = await ManageEventService.getAnalytics(eventId, "30d");
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    if (activeTab === "analytics" && dashboardData && !analyticsData) {
      fetchAnalytics();
    }
  }, [activeTab, eventId, dashboardData, analyticsData]);

  // Get unique ticket types for filter
  const attendeeTicketTypes = Array.from(new Set(attendeesList.map(a => a.ticketTypeName)));

  // Filter attendees (client-side additional filtering if needed)
  const filteredAttendees = attendeesList;

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Eye },
    { id: "attendees" as const, label: "Attendees", icon: People, count: attendeesTotal },
    { id: "analytics" as const, label: "Analytics", icon: Chart },
    { id: "team" as const, label: "Team", icon: Profile2User, count: teamMembers.length },
  ];

  const handleEdit = () => {
    router.push(`/events/${eventId}/edit`);
  };

  const handleDuplicate = async () => {
    try {
      const result = await ManageEventService.duplicateEvent(eventId);
      customToast.success("Event duplicated successfully!");
      router.push(`/events/${result.id}/edit`);
    } catch (error: any) {
      console.error("Duplicate failed:", error);
      customToast.error(error.response?.data?.message || "Failed to duplicate event");
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt("Please provide a reason for cancellation:");
    if (!reason) return;

    if (confirm("Are you sure you want to cancel this event? This action cannot be undone.")) {
      try {
        const result = await ManageEventService.cancelEvent(eventId, {
          reason,
          notifyAttendees: true,
          refundPolicy: "full",
        });
        customToast.success(`Event cancelled. ${result.attendeesNotified} attendees notified.`);
        router.push("/profile?tab=events");
      } catch (error: any) {
        console.error("Cancel failed:", error);
        customToast.error(error.response?.data?.message || "Failed to cancel event");
      }
    }
  };

  const handleExport = async () => {
    try {
      customToast.info("Exporting attendees...");
      await ManageEventService.downloadExport(eventId, "csv", filterStatus === "all" ? undefined : filterStatus);
      customToast.success("Export downloaded!");
    } catch (error: any) {
      console.error("Export failed:", error);
      customToast.error(error.response?.data?.message || "Failed to export attendees");
    }
  };

  const handleCheckIn = async (attendeeId: string) => {
    const attendee = attendeesList.find(a => a.id === attendeeId);
    if (attendee && attendee.status === "not_checked_in") {
      try {
        const result = await ManageEventService.checkInAttendee(eventId, attendeeId, {
          method: "manual",
        });

        // Update local state
        setAttendeesList(prev =>
          prev.map(a =>
            a.id === attendeeId
              ? { ...a, status: "checked_in" as const, checkInTime: result.checkInTime }
              : a
          )
        );

        customToast.success(result.message);
      } catch (error: any) {
        console.error("Check-in failed:", error);
        customToast.error(error.response?.data?.message || "Failed to check in attendee");
      }
    }
  };

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const results = await ManageEventService.searchUsers({
          q: query,
          excludeEventTeam: eventId,
        });
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddMember = async (userId: string, userName: string, userEmail: string) => {
    try {
      const result = await ManageEventService.addTeamMember(eventId, {
        userIdOrEmail: userId,
        role: selectedRole,
      });

      setTeamMembers(prev => [...prev, result.member]);
      setShowAddMemberModal(false);
      setSearchQuery("");
      setSearchResults([]);

      if (result.invitationSent) {
        customToast.success(`Invitation sent to ${userEmail}`);
      } else {
        customToast.success(`${userName} added as ${selectedRole}`);
      }
    } catch (error: any) {
      console.error("Add member failed:", error);
      customToast.error(error.response?.data?.message || "Failed to add team member");
    }
  };

  const handleInviteByEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchQuery)) {
      customToast.error("Please enter a valid email address");
      return;
    }

    if (teamMembers.some(member => member.email.toLowerCase() === searchQuery.toLowerCase())) {
      customToast.error("This email is already in the team");
      return;
    }

    try {
      const result = await ManageEventService.addTeamMember(eventId, {
        userIdOrEmail: searchQuery,
        role: selectedRole,
      });

      setTeamMembers(prev => [...prev, result.member]);
      setShowAddMemberModal(false);
      setSearchQuery("");
      setSearchResults([]);
      customToast.success(`Invitation sent to ${searchQuery}`);
    } catch (error: any) {
      console.error("Invite failed:", error);
      customToast.error(error.response?.data?.message || "Failed to send invitation");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      try {
        await ManageEventService.removeTeamMember(eventId, memberId);
        setTeamMembers(prev => prev.filter(m => m.id !== memberId));
        customToast.success("Team member removed");
      } catch (error: any) {
        console.error("Remove failed:", error);
        customToast.error(error.response?.data?.message || "Failed to remove team member");
      }
    }
  };

  const handleChangeRole = async (memberId: string, newRole: Exclude<TeamRole, "organizer">) => {
    try {
      const updated = await ManageEventService.updateTeamMember(eventId, memberId, {
        role: newRole,
      });
      setTeamMembers(prev =>
        prev.map(m => (m.id === memberId ? updated : m))
      );
      customToast.success("Role updated");
    } catch (error: any) {
      console.error("Update role failed:", error);
      customToast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      customToast.error("Please fill in subject and body");
      return;
    }

    try {
      setIsSendingEmail(true);
      const result = await ManageEventService.sendBulkEmail(eventId, {
        recipients: emailRecipients,
        attendeeIds: emailRecipients === "custom" ? selectedAttendees : undefined,
        subject: emailSubject,
        body: emailBody,
      });
      customToast.success(`${result.emailsSent} emails sent!`);
      setShowBulkEmailModal(false);
      setEmailSubject("");
      setEmailBody("");
      setSelectedAttendees([]);
    } catch (error: any) {
      console.error("Bulk email failed:", error);
      customToast.error(error.response?.data?.message || "Failed to send emails");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-foreground/60 mb-4">Event not found or you don't have access</p>
        <Button variant="primary" onClick={() => router.push("/profile")}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
            >
              <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={Share}
                onClick={() => router.push(`/events/${eventId}`)}
              >
                View Public Page
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={Edit2}
                onClick={handleEdit}
              >
                Edit Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            {event.coverImage ? (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Calendar size={48} color="currentColor" variant="Bold" className="text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                  {event.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === "PUBLISHED"
                    ? "bg-green-500/10 text-green-500"
                    : event.status === "DRAFT"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : event.status === "CANCELLED"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} color="currentColor" variant="Outline" />
                  <span>{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} color="currentColor" variant="Outline" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Location size={16} color="currentColor" variant="Outline" />
                  <span>{event.venueName || event.address || 'Online Event'}</span>
                </div>
              </div>
              <p className="text-sm text-foreground/60">
                Created on {new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-background border border-foreground/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground mb-1">
                {stats.ticketsSold}
              </div>
              <div className="text-xs text-foreground/60">Tickets Sold</div>
            </div>
            <div className="bg-background border border-foreground/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground mb-1">
                ₦{(stats.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-foreground/60">Revenue</div>
            </div>
            <div className="bg-background border border-foreground/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground mb-1">
                {stats.checkIns}
              </div>
              <div className="text-xs text-foreground/60">Check-ins</div>
            </div>
            <div className="bg-background border border-foreground/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground mb-1">
                {stats.attendanceRate}%
              </div>
              <div className="text-xs text-foreground/60">Attendance</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-foreground/10">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/20"
                    }`}
                >
                  <TabIcon
                    size={18}
                    color="currentColor"
                    variant={activeTab === tab.id ? "Bold" : "Outline"}
                  />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "bg-foreground/5 text-foreground/60"
                        }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Main Stats */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Tickets Overview */}
                <div className="lg:col-span-2 bg-background border border-foreground/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                    Ticket Sales
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground/70">Tickets Sold</span>
                        <span className="font-bold text-foreground">
                          {stats.ticketsSold} / {stats.totalTickets}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-foreground/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{
                            width: `${(stats.ticketsSold / stats.totalTickets) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-foreground/60">
                        <span>{stats.ticketsRemaining} remaining</span>
                        <span>{Math.round((stats.ticketsSold / stats.totalTickets) * 100)}% sold</span>
                      </div>
                    </div>

                    {/* Ticket Types Breakdown */}
                    <div className="pt-4 border-t border-foreground/10">
                      <h4 className="font-semibold text-foreground mb-3">By Ticket Type</h4>
                      <div className="space-y-3">
                        {ticketTypes.map((type, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-foreground/70">{type.name}</span>
                              <span className="text-sm font-semibold text-foreground">
                                {type.sold} / {type.total}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full"
                                style={{
                                  width: `${(type.sold / type.total) * 100}%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1 text-xs text-foreground/60">
                              <span>₦{type.price.toLocaleString()}</span>
                              <span>₦{type.revenue.toLocaleString()} revenue</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                    Revenue
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">
                        ₦{stats.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-foreground/60">Total Revenue</div>
                      <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
                        <ArrowUp2 size={16} color="currentColor" variant="Bold" />
                        <span>+{stats.revenueChange}% vs last event</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-foreground/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground/70">Avg. Ticket Price</span>
                        <span className="font-semibold text-foreground">
                          ₦{stats.averageTicketPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground/70">Refunds</span>
                        <span className="font-semibold text-foreground">{stats.refunds}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Stats */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <People size={24} color="currentColor" variant="Bold" className="text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stats.checkIns}</div>
                      <div className="text-sm text-foreground/60">Checked In</div>
                    </div>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {stats.attendanceRate}% attendance rate
                  </div>
                </div>

                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <User size={24} color="currentColor" variant="Bold" className="text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stats.noShows}</div>
                      <div className="text-sm text-foreground/60">No Shows</div>
                    </div>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {Math.round((stats.noShows / stats.ticketsSold) * 100)}% of sold tickets
                  </div>
                </div>

                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <MoneyRecive size={24} color="currentColor" variant="Bold" className="text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stats.refunds}</div>
                      <div className="text-sm text-foreground/60">Refunds</div>
                    </div>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {Math.round((stats.refunds / stats.ticketsSold) * 100)}% refund rate
                  </div>
                </div>
              </div>

              {/* Management Actions */}
              <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                  Event Actions
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={Edit2}
                    onClick={handleEdit}
                  >
                    Edit Event
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={Copy}
                    onClick={handleDuplicate}
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={Share}
                    onClick={() => router.push(`/events/${eventId}`)}
                  >
                    View Public
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={Trash}
                    onClick={handleCancel}
                    className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                  >
                    Cancel Event
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendees" && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                    Attendees List
                  </h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    {filteredAttendees.length} of {attendeesTotal} attendees
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={Sms}
                    onClick={() => setShowBulkEmailModal(true)}
                  >
                    Send Bulk Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Export}
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[250px]">
                    <input
                      type="text"
                      value={attendeeSearchQuery}
                      onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                      placeholder="Search by name, email, or phone..."
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                    <User
                      size={18}
                      color="currentColor"
                      variant="Outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-foreground whitespace-nowrap">Status:</label>
                    <div className="flex gap-2">
                      {[
                        { value: "all", label: "All" },
                        { value: "checked_in", label: "Checked In" },
                        { value: "not_checked_in", label: "Not Checked In" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFilterStatus(option.value as typeof filterStatus)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === option.value
                            ? "bg-primary text-white"
                            : "bg-foreground/5 text-foreground/70 hover:bg-primary/10 hover:text-primary"
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ticket Type Filter */}
                  {attendeeTicketTypes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-foreground whitespace-nowrap">Ticket:</label>
                      <select
                        value={filterTicketType}
                        onChange={(e) => setFilterTicketType(e.target.value)}
                        className="px-4 py-2 bg-background border border-foreground/20 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      >
                        <option value="all">All Types</option>
                        {attendeeTicketTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Clear Filters */}
                  {(attendeeSearchQuery || filterStatus !== "all" || filterTicketType !== "all") && (
                    <button
                      onClick={() => {
                        setAttendeeSearchQuery("");
                        setFilterStatus("all");
                        setFilterTicketType("all");
                      }}
                      className="px-4 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Attendees Table */}
              <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-foreground/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Ticket Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Purchase Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                      {filteredAttendees.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <User size={48} color="currentColor" variant="Outline" className="text-foreground/30" />
                              <div>
                                <p className="text-foreground/70 font-medium">No attendees found</p>
                                <p className="text-sm text-foreground/50 mt-1">
                                  Try adjusting your filters or search query
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredAttendees.map((attendee) => (
                          <tr key={attendee.id} className="hover:bg-foreground/5 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-semibold text-foreground">{attendee.name}</div>
                                <div className="text-sm text-foreground/60">{attendee.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {attendee.ticketTypeName}
                                </div>
                                <div className="text-xs text-foreground/60">
                                  ₦{attendee.ticketPrice.toLocaleString()}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground/70">
                              {new Date(attendee.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${attendee.status === "checked_in"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                                  }`}
                              >
                                {attendee.status === "checked_in" ? "Checked In" : "Not Checked In"}
                              </span>
                              {attendee.checkInTime && (
                                <div className="text-xs text-foreground/60 mt-1">
                                  {attendee.checkInTime}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {attendee.status === "not_checked_in" ? (
                                  <button
                                    onClick={() => handleCheckIn(attendee.id)}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm flex items-center gap-2"
                                    title="Check In"
                                  >
                                    <TickCircle size={18} color="currentColor" variant="Bold" />
                                    Check In
                                  </button>
                                ) : (
                                  <span className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium flex items-center gap-2">
                                    <TickCircle size={16} color="currentColor" variant="Bold" />
                                    Checked In
                                  </span>
                                )}
                                <a
                                  href={`mailto:${attendee.email}`}
                                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                                  title="Send Email"
                                >
                                  <Sms size={18} color="currentColor" variant="Outline" />
                                </a>
                                <a
                                  href={`tel:${attendee.phone}`}
                                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                                  title="Call"
                                >
                                  <Call size={18} color="currentColor" variant="Outline" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8">
              {/* Sales Chart */}
              <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                    Sales Over Time
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-foreground/70">Tickets Sold</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <span className="text-foreground/70">Revenue</span>
                    </div>
                  </div>
                </div>
                {/* Simple bar chart representation */}
                <div className="h-64 flex items-end justify-between gap-2">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-primary rounded-t"
                          style={{
                            height: `${(data.sales / 800) * 200}px`,
                          }}
                        />
                        <div
                          className="w-full bg-secondary/50 rounded-t"
                          style={{
                            height: `${(data.revenue / 4000000) * 200}px`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-foreground/60 rotate-45 origin-top-left">
                        {data.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Peak Sales Day</div>
                  <div className="text-2xl font-bold text-foreground mb-1">Mar 10</div>
                  <div className="text-sm text-foreground/60">120 tickets sold</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Conversion Rate</div>
                  <div className="text-2xl font-bold text-foreground mb-1">12.5%</div>
                  <div className="text-sm text-foreground/60">Page views to sales</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Avg. Time to Purchase</div>
                  <div className="text-2xl font-bold text-foreground mb-1">3.2 days</div>
                  <div className="text-sm text-foreground/60">From first view</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Top Referral Source</div>
                  <div className="text-2xl font-bold text-foreground mb-1">Social Media</div>
                  <div className="text-sm text-foreground/60">45% of sales</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Repeat Attendees</div>
                  <div className="text-2xl font-bold text-foreground mb-1">34%</div>
                  <div className="text-sm text-foreground/60">From previous events</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Check-in Rate</div>
                  <div className="text-2xl font-bold text-foreground mb-1">87%</div>
                  <div className="text-sm text-foreground/60">
                    {stats.checkIns} of {stats.ticketsSold} checked in
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                    Team Members
                  </h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    Manage who can help organize and manage this event
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Add}
                  onClick={() => setShowAddMemberModal(true)}
                >
                  Add Member
                </Button>
              </div>

              {/* Team Members List */}
              <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
                <div className="divide-y divide-foreground/10">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-6 hover:bg-foreground/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            {member.avatar ? (
                              <Image
                                src={member.avatar}
                                alt={member.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            ) : (
                              <User size={24} color="currentColor" variant="Bold" className="text-primary" />
                            )}
                          </div>

                          {/* Member Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{member.name}</h4>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${member.role === "organizer"
                                  ? "bg-primary/10 text-primary"
                                  : member.role === "co-host"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : member.role === "manager"
                                      ? "bg-green-500/10 text-green-500"
                                      : "bg-yellow-500/10 text-yellow-500"
                                  }`}
                              >
                                {member.role === "organizer"
                                  ? "Organizer"
                                  : member.role === "co-host"
                                    ? "Co-Host"
                                    : member.role === "manager"
                                      ? "Manager"
                                      : "Assistant"}
                              </span>
                              {member.status === "pending" && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-500">
                                  Pending Invitation
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground/60">{member.email}</p>
                            <p className="text-xs text-foreground/50 mt-1">
                              {member.status === "pending"
                                ? `Invited on ${member.addedDate} - Awaiting registration`
                                : `Added on ${member.addedDate}`}
                            </p>
                          </div>

                          {/* Permissions */}
                          <div className="hidden lg:flex items-center gap-6 text-sm">
                            <div className="space-y-1">
                              <div className="text-xs text-foreground/60">Permissions</div>
                              <div className="flex items-center gap-3">
                                {member.permissions.canEdit && (
                                  <span className="text-xs text-foreground/70">Edit Event</span>
                                )}
                                {member.permissions.canManageAttendees && (
                                  <span className="text-xs text-foreground/70">Manage Attendees</span>
                                )}
                                {member.permissions.canViewAnalytics && (
                                  <span className="text-xs text-foreground/70">View Analytics</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {member.role !== "organizer" && (
                            <>
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  handleChangeRole(
                                    member.id,
                                    e.target.value as "co-host" | "manager" | "assistant"
                                  )
                                }
                                className="px-3 py-1.5 bg-background border border-foreground/20 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              >
                                <option value="co-host">Co-Host</option>
                                <option value="manager">Manager</option>
                                <option value="assistant">Assistant</option>
                              </select>
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                title="Remove member"
                              >
                                <Trash size={18} color="currentColor" variant="Outline" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Permissions Info */}
              <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                <h4 className="font-semibold text-foreground mb-4">Role Permissions</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">
                        Co-Host
                      </span>
                    </div>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>• Edit event details</li>
                      <li>• Manage attendees</li>
                      <li>• View analytics</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">
                        Manager
                      </span>
                    </div>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>• Manage attendees</li>
                      <li>• View analytics</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500">
                        Assistant
                      </span>
                    </div>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>• Limited access</li>
                      <li>• View-only mode</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-foreground/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-12">
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
                    Add Team Member
                  </h3>
                  <p className="text-foreground/60">Invite someone to help manage this event</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                >
                  <CloseCircle size={24} color="currentColor" variant="Outline" />
                </button>
              </div>

              {/* Role Selection */}
              <div className="mb-8">
                <label className="block text-base font-semibold text-foreground mb-4">
                  Select Role
                </label>
                <div className="flex gap-4">
                  {(["co-host", "manager", "assistant"] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`flex-1 px-6 py-4 rounded-xl border-2 transition-all text-center ${selectedRole === role
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-foreground/20 text-foreground/70 hover:border-primary/50 hover:text-foreground"
                        }`}
                    >
                      <div className="text-base capitalize">{role.replace("-", " ")}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="mb-8">
                <label className="block text-base font-semibold text-foreground mb-4">
                  Search Users or Enter Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchUsers(e.target.value)}
                    placeholder="Search by name or enter email address..."
                    className="w-full pl-12 pr-4 py-4 bg-background border-2 border-foreground/20 rounded-xl text-base text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                  <SearchNormal
                    size={24}
                    color="currentColor"
                    variant="Outline"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mb-6">
                  <label className="block text-base font-semibold text-foreground mb-4">
                    Search Results
                  </label>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-5 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors border border-foreground/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <User size={24} color="currentColor" variant="Bold" className="text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-lg text-foreground">{user.name}</div>
                            <div className="text-sm text-foreground/60">{user.email}</div>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="md"
                          leftIcon={Add}
                          onClick={() => handleAddMember(user.id, user.name, user.email)}
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery.length > 0 && searchResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <p className="text-lg text-foreground/70 mb-2">No users found matching "{searchQuery}"</p>
                    <p className="text-base text-foreground/50">
                      Invite them by email - they'll receive login credentials to join
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={Add}
                    onClick={handleInviteByEmail}
                  >
                    Invite {searchQuery} by Email
                  </Button>
                </div>
              )}

              {searchQuery.length === 0 && (
                <div className="text-center py-16 text-foreground/60">
                  <SearchNormal
                    size={64}
                    color="currentColor"
                    variant="Outline"
                    className="mx-auto mb-4 opacity-30"
                  />
                  <p className="text-lg">Start typing to search for users</p>
                  <p className="text-sm mt-2 text-foreground/50">Or enter an email address to invite someone</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Email Modal */}
      {showBulkEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-foreground/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-12">
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
                    Send Bulk Email
                  </h3>
                  <p className="text-foreground/60">Send an email to your attendees</p>
                </div>
                <button
                  onClick={() => {
                    setShowBulkEmailModal(false);
                    setEmailSubject("");
                    setEmailBody("");
                    setEmailRecipients("all");
                    setSelectedAttendees([]);
                  }}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                >
                  <CloseCircle size={24} color="currentColor" variant="Outline" />
                </button>
              </div>

              {/* Recipient Selection */}
              <div className="mb-8">
                <label className="block text-base font-semibold text-foreground mb-4">
                  Select Recipients
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "all", label: "All Attendees", count: attendeesTotal },
                    { value: "checked_in", label: "Checked In", count: stats.checkIns },
                    { value: "not_checked_in", label: "Not Checked In", count: attendeesTotal - stats.checkIns },
                    { value: "custom", label: "Custom Selection", count: selectedAttendees.length },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setEmailRecipients(option.value as typeof emailRecipients);
                        if (option.value !== "custom") {
                          setSelectedAttendees([]);
                        }
                      }}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${emailRecipients === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-foreground/20 text-foreground/70 hover:border-primary/50 hover:text-foreground"
                        }`}
                    >
                      <div className="font-semibold text-base mb-1">{option.label}</div>
                      <div className="text-sm opacity-70">{option.count} recipients</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Selection */}
              {emailRecipients === "custom" && (
                <div className="mb-8 p-6 bg-foreground/5 rounded-xl border border-foreground/10">
                  <label className="block text-base font-semibold text-foreground mb-4">
                    Select Attendees ({selectedAttendees.length} selected)
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {attendees.map((attendee) => (
                      <label
                        key={attendee.id}
                        className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer border border-foreground/10"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAttendees.includes(attendee.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAttendees([...selectedAttendees, attendee.id]);
                            } else {
                              setSelectedAttendees(selectedAttendees.filter(id => id !== attendee.id));
                            }
                          }}
                          className="w-5 h-5 rounded border-foreground/20 text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{attendee.name}</div>
                          <div className="text-sm text-foreground/60">{attendee.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Subject */}
              <div className="mb-6">
                <label className="block text-base font-semibold text-foreground mb-3">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-base text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>

              {/* Email Body */}
              <div className="mb-8">
                <label className="block text-base font-semibold text-foreground mb-3">
                  Message
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Write your message here..."
                  rows={10}
                  className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-base text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                />
                <div className="mt-2 text-sm text-foreground/50">
                  {emailBody.length} characters
                </div>
              </div>

              {/* Preview */}
              {(emailSubject || emailBody) && (
                <div className="mb-8 p-6 bg-foreground/5 rounded-xl border border-foreground/10">
                  <div className="flex items-center gap-2 mb-4">
                    <DocumentText size={20} color="currentColor" variant="Outline" />
                    <h4 className="font-semibold text-foreground">Preview</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-foreground/50 mb-1">To:</div>
                      <div className="text-sm text-foreground/70">
                        {emailRecipients === "all" && `${attendees.length} attendees`}
                        {emailRecipients === "checked-in" && `${attendees.filter(a => a.status === "checked_in").length} checked-in attendees`}
                        {emailRecipients === "not-checked-in" && `${attendees.filter(a => a.status === "not_checked_in").length} not checked-in attendees`}
                        {emailRecipients === "custom" && `${selectedAttendees.length} selected attendees`}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-foreground/50 mb-1">Subject:</div>
                      <div className="text-sm font-semibold text-foreground">
                        {emailSubject || "(No subject)"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-foreground/50 mb-1">Message:</div>
                      <div className="text-sm text-foreground/70 whitespace-pre-wrap">
                        {emailBody || "(No message)"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShowBulkEmailModal(false);
                    setEmailSubject("");
                    setEmailBody("");
                    setEmailRecipients("all");
                    setSelectedAttendees([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={Send2}
                  onClick={async () => {
                    if (!emailSubject.trim()) {
                      alert("Please enter an email subject");
                      return;
                    }
                    if (!emailBody.trim()) {
                      alert("Please enter an email message");
                      return;
                    }

                    let recipientList: typeof attendees = [];
                    if (emailRecipients === "all") {
                      recipientList = attendees;
                    } else if (emailRecipients === "checked-in") {
                      recipientList = attendees.filter(a => a.status === "checked_in");
                    } else if (emailRecipients === "not-checked-in") {
                      recipientList = attendees.filter(a => a.status === "not_checked_in");
                    } else if (emailRecipients === "custom") {
                      if (selectedAttendees.length === 0) {
                        alert("Please select at least one attendee");
                        return;
                      }
                      recipientList = attendees.filter(a => selectedAttendees.includes(a.id));
                    }

                    setIsSendingEmail(true);
                    // Simulate API call
                    setTimeout(() => {
                      setIsSendingEmail(false);
                      alert(`Email sent successfully to ${recipientList.length} ${recipientList.length === 1 ? "attendee" : "attendees"}!`);
                      setShowBulkEmailModal(false);
                      setEmailSubject("");
                      setEmailBody("");
                      setEmailRecipients("all");
                      setSelectedAttendees([]);
                    }, 2000);
                  }}
                  disabled={isSendingEmail}
                >
                  {isSendingEmail ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagePage;

