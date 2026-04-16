"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, CalendarBlank, Ticket, Storefront, Star, Coins, Clock, Trash } from '@phosphor-icons/react';
import { NotificationService, NotificationItem } from "@/services/notifications";
import toast from "@/lib/toast";

type FilterType = "all" | "unread" | string;

const NotificationsPage = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { limit: 30 };
      if (filter === "unread") params.unread = true;
      else if (filter !== "all") params.type = filter;

      const data = await NotificationService.getNotifications(params);
      setNotifications(data.notifications);
      setHasMore(data.hasMore);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    const last = notifications[notifications.length - 1];
    if (!last) return;

    try {
      const params: any = { limit: 30, before: last.createdAt };
      if (filter === "unread") params.unread = true;
      else if (filter !== "all") params.type = filter;

      const data = await NotificationService.getNotifications(params);
      setNotifications((prev) => [...prev, ...data.notifications]);
      setHasMore(data.hasMore);
    } catch {
      toast.error("Failed to load more notifications");
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconProps = { size: 24, color: "currentColor", variant: "Bold" as const };
    switch (type) {
      case "ticket_sale":
        return <Ticket {...iconProps} className="text-primary" />;
      case "event_reminder":
      case "event_nearby":
      case "event_updated":
      case "event_cancelled":
        return <CalendarBlank {...iconProps} className="text-primary" />;
      case "booking_request":
      case "booking_accepted":
      case "booking_declined":
      case "vendor_booked":
        return <Storefront {...iconProps} className="text-secondary" />;
      case "review_received":
        return <Star {...iconProps} className="text-accent" />;
      case "payment_received":
        return <Coins {...iconProps} className="text-green-500" />;
      default:
        return <Bell {...iconProps} className="text-foreground/60" />;
    }
  };

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

  const filterOptions = [
    { value: "all", label: "All", icon: Bell },
    { value: "unread", label: "Unread", icon: Check },
    { value: "ticket_sale", label: "Tickets", icon: Ticket },
    { value: "booking_request", label: "Bookings", icon: Storefront },
    { value: "event_nearby", label: "Events", icon: CalendarBlank },
    { value: "review_received", label: "Reviews", icon: Star },
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
                <Check size={20} color="currentColor" weight="fill" />
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
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    filter === option.value
                      ? "bg-primary text-white"
                      : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                  }`}
                >
                  <Icon size={18} color="currentColor" weight="regular" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-background border border-foreground/10 rounded-2xl p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-foreground/60">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-background border border-foreground/10 rounded-2xl p-12 text-center">
              <Bell
                size={64}
                color="currentColor"
                weight="regular"
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
            <>
              {notifications.map((notification) => (
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
                          <Clock size={16} color="currentColor" weight="regular" />
                          <span>{formatTimestamp(notification.createdAt)}</span>
                        </div>
                        {notification.metadata?.amount && (
                          <span className="text-sm font-semibold text-primary">
                            {"\u20A6"}{notification.metadata.amount.toLocaleString()}
                          </span>
                        )}
                        {notification.metadata?.rating && (
                          <div className="flex items-center gap-1 text-sm text-accent">
                            <Star size={16} color="currentColor" weight="fill" />
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
                          <Check size={20} color="currentColor" weight="regular" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash size={20} color="currentColor" weight="regular" />
                      </button>
                    </div>
                  </div>
                  {notification.actionUrl && (
                    <div className="mt-4 pt-4 border-t border-foreground/10">
                      <button
                        onClick={() => {
                          if (!notification.read) handleMarkAsRead(notification.id);
                          router.push(notification.actionUrl!);
                        }}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        View details &rarr;
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={loadMore}
                  className="w-full py-3 text-center text-primary hover:underline font-medium"
                >
                  Load more
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
