"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import {
  CalendarAdd,
  Calendar,
  Ticket,
  MoneyRecive,
  People,
  TrendUp,
  ArrowUp2,
  Eye,
  Chart,
  Shop,
  Game,
} from "iconsax-react";

interface DashboardContentProps {
  events: EventCardProps[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({ events }) => {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Mock dashboard stats
  const stats = {
    totalEvents: 24,
    upcomingEvents: 5,
    totalAttendees: 3420,
    totalRevenue: 2450000,
    eventsThisMonth: 3,
    revenueChange: 12.5,
    attendeesChange: 8.3,
  };

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      type: "ticket_sale",
      message: "New ticket sale for Design Conference 2025",
      time: "2 hours ago",
      amount: "₦15,000",
    },
    {
      id: 2,
      type: "event_created",
      message: "You created a new event: Startup Networking Night",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "vendor_booked",
      message: "Vendor booking confirmed: Elite Photography Studio",
      time: "2 days ago",
    },
    {
      id: 4,
      type: "ticket_sale",
      message: "5 tickets sold for Tech Meetup Lagos",
      time: "3 days ago",
      amount: "Free",
    },
  ];

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
      label: "View Analytics",
      icon: Chart,
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
      onClick: () => console.log("View analytics"),
    },
    {
      label: "Create Game",
      icon: Game,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      onClick: () => console.log("Create game"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-1">
            Dashboard
          </h2>
          <p className="text-foreground/60">Track your event performance and manage activities</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/60">Time Range:</span>
          {(["7d", "30d", "90d", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === range
                  ? "bg-primary text-white"
                  : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
              }`}
            >
              {range === "7d"
                ? "7 Days"
                : range === "30d"
                ? "30 Days"
                : range === "90d"
                ? "90 Days"
                : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Events */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar size={24} color="currentColor" variant="Bold" className="text-primary" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUp2 size={16} color="currentColor" variant="Bold" />
              <span>{stats.eventsThisMonth} this month</span>
            </div>
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
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUp2 size={16} color="currentColor" variant="Bold" />
              <span>+{stats.attendeesChange}%</span>
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
              <MoneyRecive
                size={24}
                color="currentColor"
                variant="Bold"
                className="text-accent"
              />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUp2 size={16} color="currentColor" variant="Bold" />
              <span>+{stats.revenueChange}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            ₦{stats.totalRevenue.toLocaleString()}
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
            <div className="flex items-center gap-1 text-foreground/40 text-sm">
              <TrendUp size={16} color="currentColor" variant="Outline" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {stats.totalAttendees.toLocaleString()}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {events.slice(0, 4).map((event) => (
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
                      <p className="text-sm text-foreground/60">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-foreground/70 mb-3">
                    <span>{event.attendees} attendees</span>
                    <span>{event.price}</span>
                  </div>
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
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-foreground/10 last:border-0 last:pb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {activity.type === "ticket_sale" ? (
                      <Ticket size={16} color="currentColor" variant="Bold" className="text-primary" />
                    ) : activity.type === "event_created" ? (
                      <CalendarAdd size={16} color="currentColor" variant="Bold" className="text-primary" />
                    ) : (
                      <Shop size={16} color="currentColor" variant="Bold" className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 mb-1">
                      {activity.message}
                    </p>
                    {activity.amount && (
                      <p className="text-xs font-semibold text-primary mb-1">
                        {activity.amount}
                      </p>
                    )}
                    <p className="text-xs text-foreground/50">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div>
            <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Performance Summary
            </h3>
            <div className="bg-background border border-foreground/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Avg. Attendance Rate</span>
                <span className="font-bold text-foreground">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Avg. Ticket Price</span>
                <span className="font-bold text-foreground">₦8,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Repeat Attendees</span>
                <span className="font-bold text-foreground">34%</span>
              </div>
              <div className="pt-4 border-t border-foreground/10">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  leftIcon={Chart}
                  onClick={() => console.log("View detailed analytics")}
                >
                  View Analytics
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

