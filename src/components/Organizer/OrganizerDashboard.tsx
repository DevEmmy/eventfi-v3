"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DashboardContent from "@/components/Profile/DashboardContent";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";

const OrganizerDashboard = () => {
  const router = useRouter();

  // Mock events data
  const events: EventCardProps[] = [
    {
      id: "1",
      title: "Tech Meetup Lagos - January Edition",
      date: "Jan 25, 2025",
      time: "6:00 PM",
      location: "Lagos Tech Hub",
      price: "Free",
      category: "Tech",
      attendees: 120,
    },
    {
      id: "2",
      title: "Design Conference 2025",
      date: "Feb 10, 2025",
      time: "9:00 AM",
      location: "Eko Hotel & Suites",
      price: "₦15,000",
      category: "Design",
      attendees: 450,
    },
    {
      id: "3",
      title: "Startup Networking Night",
      date: "Feb 20, 2025",
      time: "7:00 PM",
      location: "The Foundry",
      price: "₦5,000",
      category: "Networking",
      attendees: 80,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
            Organizer Dashboard
          </h1>
          <p className="text-foreground/60">
            Manage your events, track performance, and grow your community
          </p>
        </div>

        {/* Dashboard Content */}
        <DashboardContent events={events} />
      </div>
    </div>
  );
};

export default OrganizerDashboard;

