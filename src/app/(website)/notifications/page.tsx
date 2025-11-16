"use client";

import React, { useState } from "react";
import NotificationCenter, { NotificationItem } from "@/components/Notifications/NotificationCenter";
import {
  Notification,
  Filter,
  Trash,
  Check,
  Calendar,
  Ticket,
  Shop,
  Star1,
  Location,
  MessageText1,
  MoneyRecive,
  Clock,
} from "iconsax-react";

const NotificationsPage = () => {
  const [filter, setFilter] = useState<"all" | "unread" | NotificationItem["type"]>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Mock notifications - Replace with API call
  React.useEffect(() => {
    const mockNotifications: NotificationItem[] = [
      {
        id: "1",
        type: "ticket_sale",
        title: "New Ticket Sale",
        message: "5 tickets sold for Tech Fest Lagos 2024",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        actionUrl: "/events/1/manage",
        metadata: { eventId: "1", amount: 25000 },
      },
      {
        id: "2",
        type: "booking_request",
        title: "New Booking Request",
        message: "Tech Events Nigeria requested your services for Tech Conference 2025",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        actionUrl: "/vendor/bookings",
        metadata: { bookingId: "2", eventId: "3" },
      },
      {
        id: "3",
        type: "event_nearby",
        title: "Event Near You",
        message: "Tech Fest Lagos 2024 is happening near you in 2 days",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        actionUrl: "/events/1",
        metadata: { eventId: "1" },
      },
      {
        id: "4",
        type: "review_received",
        title: "New Review",
        message: "Sarah Johnson left a 5-star review for your services",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: false,
        actionUrl: "/marketplace/1",
        metadata: { rating: 5 },
      },
      {
        id: "5",
        type: "event_reminder",
        title: "Event Reminder",
        message: "Afro Nation Festival starts tomorrow at 4:00 PM",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        actionUrl: "/events/3",
        metadata: { eventId: "3" },
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    const iconProps = { size: 24, color: "currentColor", variant: "Bold" as const };
    switch (type) {
      case "ticket_sale":
        return <Ticket {...iconProps} className="text-primary" />;
      case "event_reminder":
      case "event_nearby":
        return <Calendar {...iconProps} className="text-primary" />;
      case "booking_request":
      case "booking_accepted":
        return <Shop {...iconProps} className="text-secondary" />;
      case "review_received":
        return <Star1 {...iconProps} className="text-accent" />;
      case "payment_received":
        return <MoneyRecive {...iconProps} className="text-green-500" />;
      default:
        return <Notification {...iconProps} className="text-foreground/60" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const filterOptions = [
    { value: "all", label: "All", icon: Notification },
    { value: "unread", label: "Unread", icon: Check },
    { value: "ticket_sale", label: "Tickets", icon: Ticket },
    { value: "booking_request", label: "Bookings", icon: Shop },
    { value: "event_nearby", label: "Events", icon: Calendar },
    { value: "review_received", label: "Reviews", icon: Star1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
                Notifications
              </h1>
              <p className="text-foreground/60">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Check size={20} color="currentColor" variant="Bold" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    filter === option.value
                      ? "bg-primary text-white"
                      : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                  }`}
                >
                  <Icon size={18} color="currentColor" variant="Outline" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-background border border-foreground/10 rounded-2xl p-12 text-center">
              <Notification
                size={64}
                color="currentColor"
                variant="Outline"
                className="text-foreground/30 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-foreground mb-2">
                No notifications
              </h3>
              <p className="text-foreground/60">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "No notifications match your filter."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-background border rounded-2xl p-6 hover:border-primary transition-all ${
                  !notification.read
                    ? "border-primary/30 bg-primary/5"
                    : "border-foreground/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-foreground">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-foreground/70 mb-3">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-foreground/50">
                        <Clock size={16} color="currentColor" variant="Outline" />
                        <span>{formatTimestamp(notification.timestamp)}</span>
                      </div>
                      {notification.metadata?.amount && (
                        <span className="text-sm font-semibold text-primary">
                          ₦{notification.metadata.amount.toLocaleString()}
                        </span>
                      )}
                      {notification.metadata?.rating && (
                        <div className="flex items-center gap-1 text-sm text-accent">
                          <Star1 size={16} color="currentColor" variant="Bold" />
                          <span>{notification.metadata.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check size={20} color="currentColor" variant="Outline" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash size={20} color="currentColor" variant="Outline" />
                    </button>
                  </div>
                </div>
                {notification.actionUrl && (
                  <div className="mt-4 pt-4 border-t border-foreground/10">
                    <a
                      href={notification.actionUrl}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      View details →
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

