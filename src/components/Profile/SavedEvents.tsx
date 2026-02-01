"use client";

import React, { useState, useEffect } from "react";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import { Heart, Trash } from "iconsax-react";
import Button from "@/components/Button";
import { UserService } from "@/services/user";

const SavedEvents: React.FC = () => {
 
  const [savedEvents, setSavedEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        setLoading(true);
        const response = await UserService.getFavorites(1, 20);

        // Map API data to EventCardProps
        const mappedEvents = response.data.map((event: any) => {
          // Parse date and time from startDate
          const eventDate = new Date(event.startDate);
          const dateStr = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

          // Format price from tickets
          let priceStr = "Free";
          if (event.tickets && event.tickets.length > 0) {
            const ticket = event.tickets[0];
            if (ticket.type !== 'FREE' && ticket.price > 0) {
              const currency = ticket.currency === 'NGN' ? '₦' : ticket.currency;
              priceStr = `${currency}${ticket.price.toLocaleString()}`;
            }
          }

          return {
            id: event.id,
            title: event.title,
            date: dateStr,
            time: timeStr,
            location: event.venueName || event.city || "Online",
            price: priceStr,
            category: event.category,
            attendees: event.attendeesCount || 0,
            image: event.coverImage,
            organizer: event.organizer?.displayName,
          };
        });

        setSavedEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to fetch saved events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  const handleRemoveFavorite = async (eventId: string) => {
    try {
      await UserService.removeFavorite(eventId);
      setSavedEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
