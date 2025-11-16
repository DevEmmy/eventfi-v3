"use client";

import React from "react";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import Button from "@/components/Button";
import { CalendarAdd, Document, Chart, Eye } from "iconsax-react";

interface MyEventsProps {
  events: EventCardProps[];
  onCreateEvent?: () => void;
}

const MyEvents: React.FC<MyEventsProps> = ({ events, onCreateEvent }) => {
  if (events.length === 0) {
    return (
      <div className="bg-background border border-foreground/10 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
          <Document
            size={40}
            color="currentColor"
            variant="Outline"
            className="text-foreground/40"
          />
        </div>
        <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
          No Events Yet
        </h3>
        <p className="text-foreground/60 mb-6 max-w-md mx-auto">
          Start creating amazing events and bring your community together. Your first event is just a click away!
        </p>
        <Button
          variant="primary"
          size="lg"
          leftIcon={CalendarAdd}
          onClick={onCreateEvent}
        >
          Create Your First Event
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            My Events
          </h3>
          <p className="text-foreground/60 mt-1">
            {events.length} {events.length === 1 ? "event" : "events"} created
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={CalendarAdd}
          onClick={onCreateEvent}
        >
          Create Event
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <div key={event.id} className="group relative">
            <div
              onClick={() => {
                window.location.href = `/events/${event.id}`;
              }}
              className="cursor-pointer"
            >
              <EventCard {...event} />
            </div>
            {/* Quick Actions Overlay */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/events/${event.id}/manage`;
                }}
                className="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-background transition-colors shadow-lg"
                title="Manage Event"
              >
                <Chart size={18} color="currentColor" variant="Bold" className="text-primary" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/events/${event.id}`;
                }}
                className="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-background transition-colors shadow-lg"
                title="View Public Page"
              >
                <Eye size={18} color="currentColor" variant="Outline" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;

