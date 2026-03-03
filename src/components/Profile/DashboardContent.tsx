"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { OrganizerDashboardData } from "@/services/events";
import {
  CalendarAdd,
  Calendar,
  Ticket,
  MoneyRecive,
  People,
  ArrowUp2,
  Eye,
  Chart,
  Shop,
  Clock,
  Notification,
} from "iconsax-react";

interface DashboardContentProps {
  data: OrganizerDashboardData;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ data }) => {
  const router = useRouter();
  const { stats, recentActivity, upcomingEventsList } = data;

  const quickActions = [
    {
      label: "Create Event",
      icon: CalendarAdd,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      onClick: () => router.push("/events/create"),
    },
    {
      label: "Browse Vendors",
      icon: Shop,
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
      onClick: () => router.push("/marketplace"),
    },
    {
      label: "My Events",
      icon: Calendar,
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
      onClick: () => router.push("/profile?tab=events"),
    },
    {
      label: "Notifications",
      icon: Notification,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      onClick: () => router.push("/notifications"),
    },
  ];

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatEventDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Events */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar size={24} color="currentColor" variant="Bold" className="text-primary" />
            </div>
            {stats.eventsThisMonth > 0 && (
              <div className="flex items-center gap-1 text-green-500 text-sm">
                <ArrowUp2 size={16} color="currentColor" variant="Bold" />
                <span>{stats.eventsThisMonth} this month</span>
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {stats.totalEvents}
          </div>
          <div className="text-sm text-foreground/60">Total Events</div>
          <div className="mt-2 text-xs text-foreground/50">
            {stats.upcomingEvents} upcoming
          </div>
        </div>

        {/* Total Attendees */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <People size={24} color="currentColor" variant="Bold" className="text-secondary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {stats.totalAttendees.toLocaleString()}
          </div>
          <div className="text-sm text-foreground/60">Total Attendees</div>
          <div className="mt-2 text-xs text-foreground/50">
            Across all events
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <MoneyRecive size={24} color="currentColor" variant="Bold" className="text-accent" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {stats.totalRevenue > 1000000
              ? `₦${(stats.totalRevenue / 1000000).toFixed(1)}M`
              : `₦${stats.totalRevenue.toLocaleString()}`}
          </div>
          <div className="text-sm text-foreground/60">Total Revenue</div>
          <div className="mt-2 text-xs text-foreground/50">
            All time earnings
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Ticket size={24} color="currentColor" variant="Bold" className="text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {stats.totalTicketsSold.toLocaleString()}
          </div>
          <div className="text-sm text-foreground/60">Tickets Sold</div>
          <div className="mt-2 text-xs text-foreground/50">
            Across all events
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div>
            <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="p-6 bg-background border border-foreground/10 rounded-2xl hover:border-primary transition-all duration-200 text-center group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <ActionIcon
                        size={24}
                        color="currentColor"
                        variant="Bold"
                        className={action.iconColor}
                      />
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {action.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                Upcoming Events
              </h3>
              <button
                onClick={() => router.push("/profile?tab=events")}
                className="text-sm text-primary hover:underline"
              >
                View All
              </button>
            </div>
            {upcomingEventsList.length === 0 ? (
              <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
                <Calendar size={48} color="currentColor" variant="Outline" className="text-foreground/20 mx-auto mb-3" />
                <p className="text-foreground/60 mb-4">No upcoming events</p>
                <Button variant="primary" size="sm" onClick={() => router.push("/events/create")}>
                  Create Your First Event
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {upcomingEventsList.map((event) => (
                  <div
                    key={event.id}
                    className="bg-background border border-foreground/10 rounded-2xl p-4 hover:border-primary transition-all duration-200 cursor-pointer group"
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-sm text-foreground/60">{formatEventDate(event.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground/70 mb-3">
                      <span>{event.ticketsSold} tickets sold</span>
                      {event.revenue > 0 && (
                        <span>₦{event.revenue.toLocaleString()}</span>
                      )}
                    </div>
                    {event.venueName && (
                      <p className="text-xs text-foreground/50 mb-3">{event.venueName}{event.city ? `, ${event.city}` : ""}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={Eye}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/events/${event.id}`);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={Chart}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/events/${event.id}/manage`);
                        }}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Activity */}
          <div>
            <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Recent Activity
            </h3>
            <div className="bg-background border border-foreground/10 rounded-2xl p-6 space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-foreground/50 text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-foreground/10 last:border-0 last:pb-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {activity.type === "ticket_sale" ? (
                        <Ticket size={16} color="currentColor" variant="Bold" className="text-primary" />
                      ) : activity.type === "event_reminder" || activity.type === "event_updated" ? (
                        <Calendar size={16} color="currentColor" variant="Bold" className="text-primary" />
                      ) : activity.type === "booking_request" || activity.type === "booking_accepted" ? (
                        <Shop size={16} color="currentColor" variant="Bold" className="text-primary" />
                      ) : activity.type === "payment_received" ? (
                        <MoneyRecive size={16} color="currentColor" variant="Bold" className="text-green-500" />
                      ) : (
                        <Notification size={16} color="currentColor" variant="Bold" className="text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground/80 mb-1 line-clamp-2">
                        {activity.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-foreground/50">
                        <Clock size={12} color="currentColor" variant="Outline" />
                        <span>{formatTimestamp(activity.time)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div>
            <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Summary
            </h3>
            <div className="bg-background border border-foreground/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Total Events</span>
                <span className="font-bold text-foreground">{stats.totalEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Upcoming</span>
                <span className="font-bold text-foreground">{stats.upcomingEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Avg. Revenue / Event</span>
                <span className="font-bold text-foreground">
                  {stats.totalEvents > 0
                    ? `₦${Math.round(stats.totalRevenue / stats.totalEvents).toLocaleString()}`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Avg. Attendees / Event</span>
                <span className="font-bold text-foreground">
                  {stats.totalEvents > 0
                    ? Math.round(stats.totalAttendees / stats.totalEvents)
                    : "—"}
                </span>
              </div>
              <div className="pt-4 border-t border-foreground/10">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  leftIcon={Chart}
                  onClick={() => router.push("/profile?tab=events")}
                >
                  View All Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
