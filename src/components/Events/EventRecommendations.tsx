"use client";

import React, { useState, useEffect } from "react";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import { Sparkles, TrendingUp, Map, Calendar } from "iconsax-react";

interface EventRecommendationsProps {
  userId?: string;
  userInterests?: string[];
  userLocation?: string;
}

const EventRecommendations: React.FC<EventRecommendationsProps> = ({
  userId,
  userInterests = [],
  userLocation,
}) => {
  const [recommendations, setRecommendations] = useState<EventCardProps[]>([]);
  const [recommendationType, setRecommendationType] = useState<
    "interests" | "location" | "trending"
  >("interests");

  // Mock events - Replace with API call
  const allEvents: EventCardProps[] = [
    {
      id: "1",
      title: "Tech Fest Lagos 2024",
      date: "March 15, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Lagos Convention Centre",
      price: "₦5,000",
      category: "Technology",
      attendees: 1250,
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
      title: "Afro Nation Festival",
      date: "Mar 15, 2025",
      time: "4:00 PM",
      location: "Tafawa Balewa Square",
      price: "₦10,000",
      category: "Music",
      attendees: 5000,
    },
    {
      id: "4",
      title: "Startup Summit 2024",
      date: "April 5, 2024",
      time: "8:00 AM - 7:00 PM",
      location: "Eko Hotel & Suites",
      price: "₦10,000",
      category: "Business",
      attendees: 2100,
    },
    {
      id: "5",
      title: "DevFest Lagos",
      date: "March 30, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Google Developer Space",
      price: "Free",
      category: "Technology",
      attendees: 800,
    },
  ];

  // Get user interests from localStorage or mock
  useEffect(() => {
    const savedInterests = JSON.parse(
      localStorage.getItem("userInterests") || "[]"
    );
    const interests = savedInterests.length > 0 ? savedInterests : ["Technology", "Business"];

    // Recommendations based on interests
    const interestBased = allEvents.filter((event) =>
      interests.some((interest: string) =>
        event.category.toLowerCase().includes(interest.toLowerCase())
      )
    );

    // Recommendations based on location
    const locationBased = userLocation
      ? allEvents.filter((event) =>
          event.location.toLowerCase().includes(userLocation.toLowerCase())
        )
      : [];

    // Trending events (most attendees)
    const trending = [...allEvents]
      .sort((a, b) => (b.attendees || 0) - (a.attendees || 0))
      .slice(0, 3);

    switch (recommendationType) {
      case "interests":
        setRecommendations(interestBased.slice(0, 6));
        break;
      case "location":
        setRecommendations(locationBased.length > 0 ? locationBased : allEvents.slice(0, 6));
        break;
      case "trending":
        setRecommendations(trending);
        break;
    }
  }, [recommendationType, userLocation]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles size={24} color="currentColor" variant="Bold" className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
              Recommended for You
            </h2>
            <p className="text-sm text-foreground/60">
              Events we think you'll love
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation Type Tabs */}
      <div className="flex items-center gap-2 border-b border-foreground/10">
        <button
          onClick={() => setRecommendationType("interests")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            recommendationType === "interests"
              ? "border-primary text-primary"
              : "border-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} color="currentColor" variant="Outline" />
            <span>Based on Interests</span>
          </div>
        </button>
        <button
          onClick={() => setRecommendationType("location")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            recommendationType === "location"
              ? "border-primary text-primary"
              : "border-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Map size={16} color="currentColor" variant="Outline" />
            <span>Near You</span>
          </div>
        </button>
        <button
          onClick={() => setRecommendationType("trending")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            recommendationType === "trending"
              ? "border-primary text-primary"
              : "border-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={16} color="currentColor" variant="Outline" />
            <span>Trending</span>
          </div>
        </button>
      </div>

      {/* Recommended Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendations.map((event) => (
          <div
            key={event.id}
            onClick={() => {
              window.location.href = `/events/${event.id}`;
            }}
          >
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventRecommendations;


