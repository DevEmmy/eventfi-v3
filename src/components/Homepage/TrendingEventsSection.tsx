"use client";

import React from "react";
import EventCard from "./EventCard";
import { ArrowRight } from "iconsax-react";

const TrendingEventsSection = () => {
  // Sample event data - Replace with actual data from your API
  const trendingEvents = [
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
      title: "Afro Nation Music Festival",
      date: "March 22, 2024",
      time: "2:00 PM - 11:00 PM",
      location: "Tafawa Balewa Square",
      price: "₦15,000",
      category: "Music",
      attendees: 3500,
    },
    {
      id: "3",
      title: "DevFest Lagos",
      date: "March 30, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Google Developer Space",
      price: "Free",
      category: "Tech Meetup",
      attendees: 800,
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

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
              Trending Events Near You
            </h2>
            <p className="text-foreground/60">
              Discover what's happening this week
            </p>
          </div>
          
          {/* View All Button - Desktop Only */}
          <button
            className="hidden lg:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            onClick={() => {
              window.location.href = "#all-events";
            }}
          >
            View All
            <ArrowRight size={20} color="currentColor" variant="Outline" />
          </button>
        </div>

        {/* Events Grid/Scroll */}
        <div className="relative">
          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            <div className="flex gap-6 lg:grid lg:grid-cols-4 lg:gap-6">
              {trendingEvents.map((event) => (
                <div
                  key={event.id}
                  className="min-w-[300px] lg:min-w-0"
                  onClick={() => {
                    window.location.href = `/events/${event.id}`;
                  }}
                >
                  <EventCard {...event} />
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator - Mobile Only */}
          <div className="lg:hidden flex justify-center mt-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary/30"></div>
              <div className="w-2 h-2 rounded-full bg-primary/30"></div>
              <div className="w-2 h-2 rounded-full bg-primary/30"></div>
            </div>
          </div>
        </div>

        {/* View All Button - Mobile */}
        <div className="lg:hidden mt-8 text-center">
          <button
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            onClick={() => {
              window.location.href = "#all-events";
            }}
          >
            View All Events
            <ArrowRight size={20} color="currentColor" variant="Outline" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingEventsSection;

