"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Location,
  MessageText1,
  User,
  Clock,
  Trash,
  Check,
} from "iconsax-react";

export interface NotificationItem {
  id: string;
  type:
  | "ticket_sale"
  | "event_reminder"
  | "event_nearby"
  | "booking_request"
  | "booking_accepted"
  | "booking_declined"
  | "review_received"
  | "vendor_booked"
  | "event_updated"
  | "event_cancelled"
  | "payment_received"
  | "message"
  | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    eventId?: string;
    vendorId?: string;
    bookingId?: string;
    amount?: number;
    rating?: number;
  };
}

interface NotificationCenterProps {
  userRole?: "organizer" | "vendor" | "attendee" | "dual";
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userRole = "attendee",
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock notifications based on user role - Replace with API call
  useEffect(() => {
    const mockNotifications: NotificationItem[] = [];

    if (userRole === "organizer" || userRole === "dual") {
      // mockNotifications.push(
      //   {
      //     id: "1",
      //     type: "ticket_sale",
      //     title: "New Ticket Sale",
      //     message: "5 tickets sold for Tech Fest Lagos 2024",
      //     timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      //     read: false,
      //     actionUrl: "/events/1/manage",
      //     metadata: { eventId: "1", amount: 25000 },
      //   },
      //   {
      //     id: "2",
      //     type: "vendor_booked",
      //     title: "Vendor Booked",
      //     message: "Elite Photography Studio confirmed booking for Design Conference 2025",
      //     timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      //     read: false,
      //     actionUrl: "/events/2/manage",
      //     metadata: { vendorId: "1", bookingId: "1" },
      //   },
      //   {
      //     id: "3",
      //     type: "event_reminder",
      //     title: "Event Starting Soon",
      //     message: "Tech Meetup Lagos starts in 24 hours",
      //     timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      //     read: true,
      //     actionUrl: "/events/1",
      //     metadata: { eventId: "1" },
      //   }
      // );
    }

    if (userRole === "vendor" || userRole === "dual") {
      // mockNotifications.push(
      //   {
      //     id: "4",
      //     type: "booking_request",
      //     title: "New Booking Request",
      //     message: "Tech Events Nigeria requested your services for Tech Conference 2025",
      //     timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      //     read: false,
      //     actionUrl: "/vendor/bookings",
      //     metadata: { bookingId: "2", eventId: "3" },
      //   },
      //   {
      //     id: "5",
      //     type: "review_received",
      //     title: "New Review",
      //     message: "Sarah Johnson left a 5-star review for your services",
      //     timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      //     read: false,
      //     actionUrl: "/marketplace/1",
      //     metadata: { rating: 5 },
      //   },
      //   {
      //     id: "6",
      //     type: "payment_received",
      //     title: "Payment Received",
      //     message: "₦150,000 received for Design Conference 2025 booking",
      //     timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      //     read: true,
      //     actionUrl: "/vendor/bookings",
      //     metadata: { amount: 150000, bookingId: "1" },
      //   }
      // );
    }

    if (userRole === "attendee" || userRole === "dual") {
      // mockNotifications.push(
      //   {
      //     id: "7",
      //     type: "event_nearby",
      //     title: "Event Near You",
      //     message: "Tech Fest Lagos 2024 is happening near you in 2 days",
      //     timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      //     read: false,
      //     actionUrl: "/events/1",
      //     metadata: { eventId: "1" },
      //   },
      //   {
      //     id: "8",
      //     type: "event_reminder",
      //     title: "Event Reminder",
      //     message: "Afro Nation Festival starts tomorrow at 4:00 PM",
      //     timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      //     read: false,
      //     actionUrl: "/events/3",
      //     metadata: { eventId: "3" },
      //   },
      //   {
      //     id: "9",
      //     type: "ticket_sale",
      //     title: "Ticket Confirmed",
      //     message: "Your ticket for DevFest Lagos 2024 has been confirmed",
      //     timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      //     read: true,
      //     actionUrl: "/profile?tab=tickets",
      //     metadata: { eventId: "4" },
      //   }
      // );
    }

    // Sort by timestamp (newest first)
    mockNotifications.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
    setNotifications(mockNotifications);
  }, [userRole]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigate if action URL exists
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "ticket_sale":
        return <Ticket size={20} color="currentColor" variant="Bold" className="text-primary" />;
      case "event_reminder":
      case "event_nearby":
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
                          <span>{formatTimestamp(notification.timestamp)}</span>
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

