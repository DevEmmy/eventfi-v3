"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Notification,
  TickCircle,
  CloseCircle,
  Calendar,
  Ticket,
  MoneyRecive,
  Shop,
  Star1,
  MessageText1,
  Clock,
  Trash,
} from "iconsax-react";
import { NotificationService, NotificationItem } from "@/services/notifications";
import { useUserStore } from "@/store/useUserStore";

// Re-export for backwards compatibility
export type { NotificationItem };

interface NotificationCenterProps {
  userRole?: "organizer" | "vendor" | "attendee" | "dual";
}

const NotificationCenter: React.FC<NotificationCenterProps> = () => {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications when dropdown opens
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await NotificationService.getNotifications({ limit: 10 });
      setNotifications(data.notifications);
    } catch {
      // Silently fail for header component
    }
  }, [isAuthenticated]);

  // Fetch unread count on mount and periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCount = async () => {
      try {
        const count = await NotificationService.getUnreadCount();
        setUnreadCount(count);
      } catch {
        // Silently fail
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 60000); // Poll every 60 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.read) {
      try {
        await NotificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Continue navigation even if mark as read fails
      }
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await NotificationService.deleteNotification(id);
      const deleted = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (deleted && !deleted.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // Silently fail
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ticket_sale":
        return <Ticket size={20} color="currentColor" variant="Bold" className="text-primary" />;
      case "event_reminder":
      case "event_nearby":
      case "event_updated":
      case "event_cancelled":
        return <Calendar size={20} color="currentColor" variant="Bold" className="text-primary" />;
      case "booking_request":
      case "booking_accepted":
      case "booking_declined":
        return <Shop size={20} color="currentColor" variant="Bold" className="text-secondary" />;
      case "review_received":
        return <Star1 size={20} color="currentColor" variant="Bold" className="text-accent" />;
      case "vendor_booked":
        return <TickCircle size={20} color="currentColor" variant="Bold" className="text-green-500" />;
      case "payment_received":
        return <MoneyRecive size={20} color="currentColor" variant="Bold" className="text-green-500" />;
      case "message":
        return <MessageText1 size={20} color="currentColor" variant="Bold" className="text-primary" />;
      default:
        return <Notification size={20} color="currentColor" variant="Bold" className="text-foreground/60" />;
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-foreground/70 hover:text-primary transition-colors"
        aria-label="Notifications"
      >
        <Notification
          size={24}
          color="currentColor"
          variant={isOpen ? "Bold" : "Outline"}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-background border border-foreground/10 rounded-2xl shadow-xl z-50 max-h-[75vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-foreground/10">
            <h3 className="text-lg font-bold text-foreground">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-foreground/10 rounded-lg transition-colors"
                aria-label="Close notifications"
              >
                <CloseCircle size={20} color="currentColor" variant="Outline" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Notification
                  size={48}
                  color="currentColor"
                  variant="Outline"
                  className="text-foreground/30 mx-auto mb-3"
                />
                <p className="text-foreground/60">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-foreground/10">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-foreground/5 transition-colors cursor-pointer relative group ${!notification.read ? "bg-primary/5" : ""
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-foreground text-sm">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-foreground/70 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-foreground/50">
                          <Clock size={14} color="currentColor" variant="Outline" />
                          <span>{formatTimestamp(notification.createdAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteNotification(notification.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-foreground/10 rounded transition-all shrink-0"
                        aria-label="Delete notification"
                      >
                        <Trash size={16} color="currentColor" variant="Outline" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-foreground/10">
              <button
                onClick={() => {
                  router.push("/notifications");
                  setIsOpen(false);
                }}
                className="w-full text-sm text-primary hover:underline font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
