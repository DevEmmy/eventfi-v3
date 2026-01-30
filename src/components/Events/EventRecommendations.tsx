"use client";

import React, { useState, useEffect } from "react";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import { Star1, TrendUp, Map, Calendar } from "iconsax-react";
import { EventService } from "@/services/events";

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
  // State
  const [recommendations, setRecommendations] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendationType, setRecommendationType] = useState<
    "interests" | "location" | "trending"
  >("interests");

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format price helper
  const formatPrice = (tickets: any[]) => {
    if (!tickets || tickets.length === 0) return "Free";
    const paidTickets = tickets.filter(t => t.type === 'PAID');
    if (paidTickets.length === 0) return "Free";
    const minPrice = Math.min(...paidTickets.map(t => t.price));
    return `₦${minPrice.toLocaleString()}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let events: any[] = [];

        switch (recommendationType) {
          case "interests":
            // Try api recommendations first, fallback to general if empty or error
            try {
              events = await EventService.getRecommendations();
            } catch (err) {
              console.warn("Failed to fetch recommendations, falling back to general", err);
              const response = await EventService.getEvents({ limit: 6 });
              events = response.data;
            }
            break;

          case "location":
            if (userLocation) {
              const response = await EventService.getEvents({
                city: userLocation,
                limit: 6
              });
              events = response.data;
            } else {
              // Fallback if no location set
              const response = await EventService.getEvents({ limit: 6 });
              events = response.data;
            }
            break;

          case "trending":
            // For trending, we might fetch more and sort, or use a specific endpoint if available. 
            // Using general getEvents for now, assuming backend handles trending logic or we just show latest.
            const response = await EventService.getEvents({ limit: 6 });
            events = response.data;
            // Client side sort by attendees if available in response
            if (events.length > 0 && events[0].attendeesCount !== undefined) {
              events.sort((a, b) => (b.attendeesCount || 0) - (a.attendeesCount || 0));
            }
            break;
        }

        // Map API response to EventCardProps
        const mappedEvents: EventCardProps[] = events.map(event => ({
          id: event.id,
          title: event.title,
          date: formatDate(event.startDate),
          time: `${event.startTime} - ${event.endTime}`,
          location: event.venueName || event.city || "Online",
          price: formatPrice(event.tickets),
          category: event.category,
          image: event.coverImage,
          attendees: event.attendeesCount
        }));

        setRecommendations(mappedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [recommendationType, userLocation]);

  // if (recommendations.length === 0) {
  //   return null;
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Star1 size={24} color="currentColor" variant="Bold" className="text-primary" />
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
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${recommendationType === "interests"
            ? "border-primary text-primary"
            : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
        >
          <div className="flex items-center gap-2">
            <Star1 size={16} color="currentColor" variant="Outline" />
            <span>Based on Interests</span>
          </div>
        </button>
        <button
          onClick={() => setRecommendationType("location")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${recommendationType === "location"
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
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${recommendationType === "trending"
            ? "border-primary text-primary"
            : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
        >
          <div className="flex items-center gap-2">
            <TrendUp size={16} color="currentColor" variant="Outline" />
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


