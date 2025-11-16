"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import EventCard from "@/components/Homepage/EventCard";
import {
  Calendar,
  Location,
  Clock,
  Ticket,
  Share,
  Heart,
  User,
  ArrowLeft2,
  Map,
  People,
  Tag,
  Chart,
} from "iconsax-react";
import { useRouter } from "next/navigation";

interface EventDetailPageProps {
  eventId: string;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ eventId }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  // Mock: Check if current user is the organizer
  // In production, this would come from auth context
  const isOrganizer = true; // Replace with actual auth check

  // Sample event data - Replace with API call
  const event = {
    id: eventId,
    title: "Tech Fest Lagos 2024",
    date: "March 15, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Lagos Convention Centre",
    address: "Victoria Island, Lagos, Nigeria",
    price: "₦5,000",
    category: "Technology",
    attendees: 1250,
    image: undefined,
    organizer: {
      name: "Tech Events Nigeria",
      verified: true,
    },
    description: `Join us for the biggest tech festival in Lagos! Tech Fest Lagos 2024 brings together innovators, developers, entrepreneurs, and tech enthusiasts for a day of networking, learning, and inspiration.

This year's event features:
- Keynote speeches from industry leaders
- Technical workshops and hands-on sessions
- Startup pitch competitions
- Networking opportunities
- Tech exhibitions and demos

Whether you're a seasoned developer or just starting your tech journey, Tech Fest Lagos has something for everyone. Don't miss out on this incredible opportunity to connect with the tech community and discover the latest trends and innovations.`,
    schedule: [
      { time: "10:00 AM", activity: "Registration & Networking" },
      { time: "11:00 AM", activity: "Opening Keynote" },
      { time: "12:00 PM", activity: "Technical Workshops" },
      { time: "2:00 PM", activity: "Lunch Break" },
      { time: "3:00 PM", activity: "Startup Pitch Competition" },
      { time: "5:00 PM", activity: "Closing Remarks & Networking" },
    ],
    tags: ["Technology", "Networking", "Startups", "Innovation"],
  };

  // Related events - Replace with API call
  const relatedEvents = [
    {
      id: "2",
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} on EventFi!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
        >
          <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
          <span>Back to Events</span>
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="relative container mx-auto h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar
              size={120}
              color="currentColor"
              variant="Bold"
              className="text-primary/30"
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isOrganizer && (
            <button
              onClick={() => router.push(`/events/${eventId}/manage`)}
              className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors backdrop-blur-sm flex items-center gap-2"
              aria-label="Manage event"
            >
              <Chart size={16} color="currentColor" variant="Bold" />
              Manage
            </button>
          )}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Add to favorites"
          >
            <Heart
              size={20}
              color="currentColor"
              variant={isFavorite ? "Bold" : "Outline"}
              className={isFavorite ? "text-primary" : "text-foreground"}
            />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Share event"
          >
            <Share size={20} color="currentColor" variant="Outline" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full text-sm font-semibold text-primary">
            {event.category}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                {event.title}
              </h1>

              {/* Event Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-foreground/70">
                  <Calendar size={20} color="currentColor" variant="Outline" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Clock size={20} color="currentColor" variant="Outline" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Location size={20} color="currentColor" variant="Outline" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <People size={20} color="currentColor" variant="Outline" />
                  <span>{event.attendees.toLocaleString()} going</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-foreground/5 rounded-full text-sm text-foreground/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Organizer Info */}
            <div className="p-6 bg-foreground/5 rounded-2xl border border-foreground/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={32} color="currentColor" variant="Bold" className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {event.organizer.name}
                    </h3>
                    {event.organizer.verified && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60">Event Organizer</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                About This Event
              </h2>
              <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Schedule */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                Schedule
              </h2>
              <div className="space-y-3">
                {event.schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-foreground/5 rounded-xl border border-foreground/10"
                  >
                    <div className="font-semibold text-primary min-w-[100px]">
                      {item.time}
                    </div>
                    <div className="text-foreground/70">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                Location
              </h2>
              <div className="bg-foreground/5 rounded-2xl border border-foreground/10 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Map size={24} color="currentColor" variant="Bold" className="text-primary" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      {event.location}
                    </p>
                    <p className="text-foreground/70 text-sm">{event.address}</p>
                  </div>
                </div>
                {/* Map placeholder - Replace with actual map component */}
                <div className="w-full h-64 bg-foreground/10 rounded-xl flex items-center justify-center">
                  <Map size={48} color="currentColor" variant="Outline" className="text-foreground/30" />
                </div>
              </div>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-6 text-foreground">
                  You Might Also Like
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {relatedEvents.map((relatedEvent) => (
                    <div
                      key={relatedEvent.id}
                      onClick={() => {
                        router.push(`/events/${relatedEvent.id}`);
                      }}
                    >
                      <EventCard {...relatedEvent} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Ticket Purchase */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-background border-2 border-foreground/10 rounded-2xl p-6 lg:p-8 shadow-lg">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-foreground">
                      {event.price}
                    </span>
                    {event.price !== "Free" && (
                      <span className="text-sm text-foreground/60">per ticket</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60">
                    {event.attendees.toLocaleString()} people going
                  </p>
                </div>

                {/* Ticket Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Number of Tickets
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        setTicketQuantity(Math.max(1, ticketQuantity - 1))
                      }
                      className="w-10 h-10 rounded-full border-2 border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-foreground min-w-[3rem] text-center">
                      {ticketQuantity}
                    </span>
                    <button
                      onClick={() => setTicketQuantity(ticketQuantity + 1)}
                      className="w-10 h-10 rounded-full border-2 border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                {event.price !== "Free" && (
                  <div className="mb-6 p-4 bg-primary/10 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Total</span>
                      <span className="text-xl font-bold text-primary">
                        ₦{parseInt(event.price.replace(/[₦,]/g, "")) * ticketQuantity}
                      </span>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    // Handle ticket purchase
                    window.location.href = `/events/${eventId}/checkout?qty=${ticketQuantity}`;
                  }}
                >
                  <Ticket size={20} color="currentColor" variant="Bold" />
                  Get Tickets
                </Button>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-foreground/10 space-y-3 text-sm text-foreground/60">
                  <div className="flex items-start gap-2">
                    <Tag size={16} color="currentColor" variant="Outline" />
                    <span>Free cancellation up to 24 hours before event</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Ticket size={16} color="currentColor" variant="Outline" />
                    <span>Mobile tickets accepted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

