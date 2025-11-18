"use client";

import React from "react";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import Button from "@/components/Button";
import { Ticket, Document, Star1 } from "iconsax-react";

interface MyTicketsProps {
  tickets: (EventCardProps & {
    ticketId: string;
    status: "upcoming" | "past" | "cancelled";
    purchaseDate: string;
  })[];
}

const MyTickets: React.FC<MyTicketsProps> = ({ tickets }) => {
  const upcomingTickets = tickets.filter((t) => t.status === "upcoming");
  const pastTickets = tickets.filter((t) => t.status === "past");

  if (tickets.length === 0) {
    return (
      <div className="bg-background border border-foreground/10 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
          <Ticket
            size={40}
            color="currentColor"
            variant="Outline"
            className="text-foreground/40"
          />
        </div>
        <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
          No Tickets Yet
        </h3>
        <p className="text-foreground/60 mb-6 max-w-md mx-auto">
          Start exploring events and book your tickets to amazing experiences!
        </p>
        <button
          onClick={() => {
            window.location.href = "/explore-events";
          }}
          className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          Explore Events
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upcoming Events */}
      {upcomingTickets.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Ticket
              size={24}
              color="currentColor"
              variant="Bold"
              className="text-primary"
            />
            <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
              Upcoming Events
            </h3>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {upcomingTickets.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingTickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                onClick={() => {
                  window.location.href = `/events/${ticket.id}`;
                }}
              >
                <EventCard {...ticket} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastTickets.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Ticket
              size={24}
              color="currentColor"
              variant="Outline"
              className="text-foreground/60"
            />
            <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground/60">
              Past Events
            </h3>
            <span className="px-3 py-1 bg-foreground/5 text-foreground/60 rounded-full text-sm font-medium">
              {pastTickets.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pastTickets.map((ticket) => (
              <div key={ticket.ticketId} className="relative group">
              <div
                onClick={() => {
                  window.location.href = `/events/${ticket.id}`;
                }}
                  className="opacity-60 cursor-pointer"
              >
                <EventCard {...ticket} />
                </div>
                {/* Review Button Overlay */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    leftIcon={Star1}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/events/${ticket.id}/review`;
                    }}
                  >
                    Review Event
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;

