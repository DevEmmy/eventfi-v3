"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
  Shop,
  Calendar,
  MoneyRecive,
  People,
  Star1,
  ArrowUp2,
  ArrowDown2,
  MessageText1,
  Eye,
  TickCircle,
  Clock,
  Chart,
  Edit2,
  Share,
  Game,
} from "iconsax-react";

interface VendorDashboardContentProps {
  // This would typically come from props or context
}

const VendorDashboardContent: React.FC<VendorDashboardContentProps> = () => {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Mock vendor stats - Replace with API call
  const stats = {
    totalBookings: 48,
    upcomingBookings: 5,
    totalRevenue: 3200000,
    averageRating: 4.8,
    totalReviews: 127,
    responseRate: 94,
    portfolioViews: 3420,
    bookingRequests: 12,
    completedBookings: 43,
    revenueChange: 18.5,
    bookingsChange: 12.3,
  };

  // Mock booking requests
  const bookingRequests = [
    {
      id: "1",
      eventName: "Tech Conference 2025",
      eventDate: "Mar 20, 2025",
      organizer: "Tech Events Nigeria",
      serviceType: "Photography",
      budget: "₦150,000",
      status: "pending",
      requestDate: "2 hours ago",
    },
    {
      id: "2",
      eventName: "Wedding Celebration",
      eventDate: "Apr 5, 2025",
      organizer: "Sarah Johnson",
      serviceType: "Full Coverage",
      budget: "₦200,000",
      status: "accepted",
      requestDate: "1 day ago",
    },
    {
      id: "3",
      eventName: "Corporate Gala",
      eventDate: "Apr 15, 2025",
      organizer: "ABC Corporation",
      serviceType: "Event Photography",
      budget: "₦180,000",
      status: "pending",
      requestDate: "3 days ago",
    },
  ];

  // Mock upcoming bookings
  const upcomingBookings = [
    {
      id: "1",
      eventName: "Design Conference 2025",
      eventDate: "Feb 10, 2025",
      eventTime: "9:00 AM",
      organizer: "Design Hub Lagos",
      serviceType: "Photography",
      amount: "₦150,000",
      status: "confirmed",
    },
    {
      id: "2",
      eventName: "Startup Networking Night",
      eventDate: "Feb 20, 2025",
      eventTime: "7:00 PM",
      organizer: "Startup Lagos",
      serviceType: "Event Coverage",
      amount: "₦120,000",
      status: "confirmed",
    },
    {
      id: "3",
      eventName: "Music Festival",
      eventDate: "Mar 5, 2025",
      eventTime: "4:00 PM",
      organizer: "Music Events Co",
      serviceType: "Full Coverage",
      amount: "₦250,000",
      status: "confirmed",
    },
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      type: "booking_accepted",
      message: "Booking accepted for Tech Conference 2025",
      time: "2 hours ago",
      amount: "₦150,000",
    },
    {
      id: 2,
      type: "review_received",
      message: "New 5-star review from Sarah Johnson",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "booking_request",
      message: "New booking request: Corporate Gala",
      time: "3 days ago",
    },
    {
      id: 4,
      type: "payment_received",
      message: "Payment received for Wedding Celebration",
      time: "5 days ago",
      amount: "₦200,000",
    },
  ];

  const quickActions = [
    {
      label: "View Profile",
      icon: Eye,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      onClick: () => router.push("/marketplace/1"),
    },
    {
      label: "Edit Profile",
      icon: Edit2,
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
      onClick: () => router.push("/vendor/edit"),
    },
    {
      label: "Browse Events",
      icon: Calendar,
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
      onClick: () => router.push("/explore-events"),
    },
    {
      label: "View Analytics",
      icon: Chart,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      onClick: () => console.log("View analytics"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            Vendor Dashboard
          </h2>
          <p className="text-foreground/60 mt-1">
            Track your bookings, revenue, and performance
          </p>
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
        {/* Total Bookings */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar size={24} color="currentColor" variant="Bold" className="text-primary" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUp2 size={16} color="currentColor" variant="Bold" />
              <span>+{stats.bookingsChange}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {stats.totalBookings}
          </div>
          <div className="text-sm text-foreground/60">Total Bookings</div>
          <div className="mt-2 text-xs text-foreground/50">
            {stats.upcomingBookings} upcoming
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <MoneyRecive
                size={24}
                color="currentColor"
                variant="Bold"
                className="text-secondary"
              />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUp2 size={16} color="currentColor" variant="Bold" />
              <span>+{stats.revenueChange}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            ₦{(stats.totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-foreground/60">Total Revenue</div>
          <div className="mt-2 text-xs text-foreground/50">
            All time earnings
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Star1 size={24} color="currentColor" variant="Bold" className="text-accent" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {stats.averageRating}
          </div>
          <div className="text-sm text-foreground/60">Average Rating</div>
          <div className="mt-2 text-xs text-foreground/50">
            {stats.totalReviews} reviews
          </div>
        </div>

        {/* Response Rate */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageText1
                size={24}
                color="currentColor"
                variant="Bold"
                className="text-primary"
              />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {stats.responseRate}%
          </div>
          <div className="text-sm text-foreground/60">Response Rate</div>
          <div className="mt-2 text-xs text-foreground/50">
            Last 30 days
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Quick Actions
            </h2>
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

          {/* Booking Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                Booking Requests
              </h2>
              <button
                onClick={() => router.push("/vendor/bookings")}
                className="text-sm text-primary hover:underline"
              >
                View All
              </button>
            </div>
            <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
              <div className="divide-y divide-foreground/10">
                {bookingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-6 hover:bg-foreground/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1">
                          {request.eventName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/60 mb-2">
                          <span>{request.organizer}</span>
                          <span>•</span>
                          <span>{request.eventDate}</span>
                          <span>•</span>
                          <span>{request.serviceType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">
                            {request.budget}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              request.status === "accepted"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {request.status === "accepted" ? "Accepted" : "Pending"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-foreground/50">
                        {request.requestDate}
                      </div>
                    </div>
                    {request.status === "pending" && (
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => console.log("Accept booking", request.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log("Decline booking", request.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                Upcoming Bookings
              </h2>
              <button
                onClick={() => router.push("/vendor/bookings")}
                className="text-sm text-primary hover:underline"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-background border border-foreground/10 rounded-2xl p-4 hover:border-primary transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">
                        {booking.eventName}
                      </h3>
                      <p className="text-sm text-foreground/60 mb-2">
                        {booking.eventDate} • {booking.eventTime}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2">
                        <span>{booking.organizer}</span>
                        <span>•</span>
                        <span>{booking.serviceType}</span>
                      </div>
                      <div className="font-semibold text-primary">
                        {booking.amount}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-semibold">
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => router.push(`/events/${booking.id}`)}
                    >
                      View Event
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
            <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Recent Activity
            </h2>
            <div className="bg-background border border-foreground/10 rounded-2xl p-6 space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-foreground/10 last:border-0 last:pb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {activity.type === "booking_accepted" ? (
                      <TickCircle size={16} color="currentColor" variant="Bold" className="text-primary" />
                    ) : activity.type === "review_received" ? (
                      <Star1 size={16} color="currentColor" variant="Bold" className="text-primary" />
                    ) : activity.type === "booking_request" ? (
                      <Calendar size={16} color="currentColor" variant="Bold" className="text-primary" />
                    ) : (
                      <MoneyRecive size={16} color="currentColor" variant="Bold" className="text-primary" />
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
            <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Performance Summary
            </h2>
            <div className="bg-background border border-foreground/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Portfolio Views</span>
                <span className="font-bold text-foreground">
                  {stats.portfolioViews.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Avg. Booking Value</span>
                <span className="font-bold text-foreground">
                  ₦{Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Completion Rate</span>
                <span className="font-bold text-foreground">
                  {Math.round((stats.completedBookings / stats.totalBookings) * 100)}%
                </span>
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

export default VendorDashboardContent;

