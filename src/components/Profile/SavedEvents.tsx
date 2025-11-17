"use client";

import React, { useState, useEffect } from "react";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import { Heart, Trash } from "iconsax-react";
import Button from "@/components/Button";

const SavedEvents: React.FC = () => {
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [savedEvents, setSavedEvents] = useState<EventCardProps[]>([]);

  // Mock all events - Replace with API call
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
  ];

  useEffect(() => {
    // Load saved events from localStorage
    const favorites = JSON.parse(localStorage.getItem("favoriteEvents") || "[]");
    setSavedEventIds(favorites);
    
    // Filter events that are saved
    const saved = allEvents.filter((event) => favorites.includes(event.id));
    setSavedEvents(saved);
  }, []);

  const handleRemoveFavorite = (eventId: string) => {
    const newFavorites = savedEventIds.filter((id) => id !== eventId);
    localStorage.setItem("favoriteEvents", JSON.stringify(newFavorites));
    setSavedEventIds(newFavorites);
    setSavedEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  if (savedEvents.length === 0) {
    return (
      <div className="bg-background border border-foreground/10 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
          <Heart
            size={40}
            color="currentColor"
            variant="Outline"
            className="text-foreground/40"
          />
        </div>
        <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
          No Saved Events Yet
        </h3>
        <p className="text-foreground/60 mb-6 max-w-md mx-auto">
          Start exploring events and save the ones you're interested in by clicking the heart icon!
        </p>
        <Button
          variant="primary"
          onClick={() => {
            window.location.href = "/explore-events";
          }}
        >
          Explore Events
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            Saved Events
          </h3>
          <p className="text-sm text-foreground/60 mt-1">
            {savedEvents.length} {savedEvents.length === 1 ? "event" : "events"} saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedEvents.map((event) => (
          <div key={event.id} className="relative group">
            <div
              onClick={() => {
                window.location.href = `/events/${event.id}`;
              }}
            >
              <EventCard {...event} />
            </div>
            {/* Remove Button Overlay */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(event.id);
                }}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                aria-label="Remove from saved"
              >
                <Trash size={18} color="currentColor" variant="Bold" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedEvents;


