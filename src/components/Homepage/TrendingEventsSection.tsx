"use client";

import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { ArrowRight } from "iconsax-react";
import { EventService } from "@/services/events";

const TrendingEventsSection = () => {
  const [trendingEvents, setTrendingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingEvents = async () => {
      try {
        setLoading(true);
        const data = await EventService.getTrendingEvents(8);

        // Map API response to component format
        const mappedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          time: `${event.startTime} - ${event.endTime}`,
          location: event.venueName || event.city || "Online",
          price: event.tickets && event.tickets.length > 0
            ? (event.tickets[0].type === 'FREE' ? 'Free' : `₦${event.tickets[0].price.toLocaleString()}`)
            : "Free",
          category: event.category,
          attendees: event.attendeesCount || 0,
          image: event.coverImage,
        }));

        setTrendingEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to fetch trending events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingEvents();
  }, []);

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
              window.location.href = "/explore-events";
            }}
          >
            View All
            <ArrowRight size={20} color="currentColor" variant="Outline" />
          </button>
        </div>

        {/* Events Grid/Scroll */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : trendingEvents.length === 0 ? (
            <div className="text-center py-12 text-foreground/60">
              No trending events at the moment
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* View All Button - Mobile */}
        <div className="lg:hidden mt-8 text-center">
          <button
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            onClick={() => {
              window.location.href = "/explore-events";
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

