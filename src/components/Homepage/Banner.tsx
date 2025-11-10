"use client";

import React, { useState, useEffect } from "react";
import Button from "../Button";
import {
  CalendarAdd,
  Shop,
  Location,
  PlayCircle,
  MusicPlaylist,
  Code,
  Game,
} from "iconsax-react";

const Banner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-transition every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % 2);
        setIsTransitioning(false);
      }, 300); // Half of transition duration
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Organizer-focused content
  const organizerContent = {
    headline: (
      <>
        Host Better Events,
        <br />
        <span className="text-primary">Not Just Ticket Sales.</span>
      </>
    ),
    subheadline:
      "The complete toolkit for organizers: Ticketing, logistics, vendor bookings, and live engagement—all in one place.",
    primaryCTA: {
      label: "Create Event",
      icon: CalendarAdd,
      href: "#create-event",
    },
    secondaryCTA: {
      label: "Explore Marketplace",
      icon: Shop,
      href: "#marketplace",
    },
    trustSignal: (
      <>
        Trusted by <span className="font-semibold text-foreground">500+</span>{" "}
        organizers for{" "}
        <span className="font-medium text-primary">Conferences</span>,{" "}
        <span className="font-medium text-primary">Parties</span>, and{" "}
        <span className="font-medium text-primary">Meetups</span>.
      </>
    ),
    visual: "organizer",
  };

  // Attendee-focused content
  const attendeeContent = {
    headline: (
      <>
        Experience Events
        <br />
        <span className="text-primary">Like Never Before.</span>
      </>
    ),
    subheadline:
      "Discover premier local events, book tickets instantly, and unlock exclusive in-event games and rewards.",
    primaryCTA: {
      label: "Explore",
      icon: Location,
      href: "#explore-events",
    },
    secondaryCTA: {
      label: "How it Works",
      icon: PlayCircle,
      href: "#how-it-works",
    },
    trustSignal:  (
        <>
          Trusted by <span className="font-semibold text-foreground">500+</span>{" "}
          organizers for{" "}
          <span className="font-medium text-primary">Conferences</span>,{" "}
          <span className="font-medium text-primary">Parties</span>, and{" "}
          <span className="font-medium text-primary">Meetups</span>.
        </>
      ),
    visual: "attendee",
  };

  const currentContent = activeSlide === 0 ? organizerContent : attendeeContent;

  // Trending events for social proof ticker
  const trendingEvents = [
    "Tech Fest Lagos",
    "Afro Nation",
    "DevFest",
    "Music Festival 2024",
    "Startup Summit",
    "Gaming Night",
  ];

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="flex flex-col gap-6 lg:gap-8 text-center lg:text-left">
            {/* Headline with transition */}
            <div
              className={`transition-opacity duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <h1 className="text-4xl sm:text-5xl md:text-5xl xl:text-7xl font-bold leading-tight">
                {currentContent.headline}
              </h1>
            </div>

            {/* Subheadline with transition */}
            <div
              className={`transition-opacity duration-500 delay-75 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <p className="text-lg md:text-lg text-foreground/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {currentContent.subheadline}
              </p>
            </div>

            {/* CTAs with transition */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4 transition-opacity duration-500 delay-150 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <Button
                variant="primary"
                size="md"
                leftIcon={currentContent.primaryCTA.icon}
                iconVariant="Bold"
                onClick={() => {
                  window.location.href = currentContent.primaryCTA.href;
                }}
              >
                {currentContent.primaryCTA.label}
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={currentContent.secondaryCTA.icon}
                onClick={() => {
                  window.location.href = currentContent.secondaryCTA.href;
                }}
              >
                {currentContent.secondaryCTA.label}
              </Button>
            </div>

            {/* Trust Signal / Social Proof */}
            <div
              className={`mt-6 lg:mt-8 transition-opacity duration-500 delay-300 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              
                <p className="text-sm md:text-base text-foreground/60">
                  {currentContent.trustSignal}
                </p>
            
            </div>
          </div>

          {/* Right Side - Visual with transition */}
          <div
            className={`relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl transition-opacity duration-500 delay-75 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {activeSlide === 0 ? (
              // Organizer Visual - Split Screen Dashboard
              <div className="grid grid-cols-2 h-full gap-2">
                {/* Left Side - Dashboard Preview */}
                <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-xl overflow-hidden border border-primary/20">
                  <div className="absolute inset-0 p-4 flex flex-col gap-3">
                    <div className="h-8 bg-primary/20 rounded-lg flex items-center px-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <div className="h-2 bg-primary/30 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-primary/20 rounded w-1/2"></div>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-2">
                        <div className="h-2 bg-primary/30 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-primary/20 rounded w-1/2"></div>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-2 col-span-2">
                        <div className="h-2 bg-primary/30 rounded w-2/3 mb-2"></div>
                        <div className="h-2 bg-primary/20 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-medium text-foreground/80">
                      Event Dashboard
                    </div>
                  </div>
                </div>

                {/* Right Side - Attendees at Event */}
                <div className="relative bg-gradient-to-br from-accent/10 via-accent/5 to-background rounded-xl overflow-hidden border border-accent/20">
                  <div className="absolute inset-0 p-4 flex flex-col gap-3">
                    <div className="flex-1 flex items-end justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-accent/50"></div>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-accent/40 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-accent/60"></div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-accent/50"></div>
                      </div>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-2">
                      <div className="h-2 bg-accent/30 rounded w-2/3 mb-1"></div>
                      <div className="h-1.5 bg-accent/20 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-medium text-foreground/80">
                      Live Event Experience
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Attendee Visual - High-energy Event Collage
              <div className="relative h-full bg-gradient-to-br from-secondary/10 via-accent/10 to-primary/10 rounded-xl overflow-hidden border border-primary/20">
                {/* Event Collage Grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1.5 sm:gap-2 p-1.5 sm:p-2">
                  {/* Concert Scene */}
                  <div className="col-span-2 row-span-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <MusicPlaylist
                      size={24}
                      color="currentColor"
                      variant="Bold"
                      className="text-primary/40"
                    />
                    <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2">
                      <div className="bg-background/80 backdrop-blur-sm rounded px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-foreground/80">
                        Concerts
                      </div>
                    </div>
                  </div>

                  {/* Tech Meetup */}
                  <div className="col-span-1 row-span-1 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <Code
                      size={16}
                      color="currentColor"
                      variant="Bold"
                      className="text-secondary/40 sm:w-6 sm:h-6 md:w-8 md:h-8"
                    />
                    <div className="absolute bottom-0.5 sm:bottom-1 left-0.5 sm:left-1 right-0.5 sm:right-1">
                      <div className="bg-background/80 backdrop-blur-sm rounded px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-xs font-medium text-foreground/80">
                        Tech
                      </div>
                    </div>
                  </div>

                  {/* Gaming Night */}
                  <div className="col-span-1 row-span-1 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <Game
                      size={16}
                      color="currentColor"
                      variant="Bold"
                      className="text-accent/40 sm:w-6 sm:h-6 md:w-8 md:h-8"
                    />
                    <div className="absolute bottom-0.5 sm:bottom-1 left-0.5 sm:left-1 right-0.5 sm:right-1">
                      <div className="bg-background/80 backdrop-blur-sm rounded px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-xs font-medium text-foreground/80">
                        Gaming
                      </div>
                    </div>
                  </div>

                  {/* People Icons - Multiple Event Types */}
                  <div className="col-span-1 row-span-2 bg-gradient-to-br from-primary/15 to-accent/10 rounded-lg flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3">
                    <div className="flex gap-0.5 sm:gap-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/30"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent/30"></div>
                    </div>
                    <div className="flex gap-0.5 sm:gap-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary/30"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/30"></div>
                    </div>
                    <div className="text-[9px] sm:text-xs font-medium text-foreground/60 mt-1 sm:mt-2 text-center">
                      Live Events
                    </div>
                  </div>

                  {/* More Event Types */}
                  <div className="col-span-2 row-span-1 bg-gradient-to-br from-secondary/15 to-primary/10 rounded-lg flex items-center justify-center gap-2 sm:gap-3 p-1.5 sm:p-2">
                    <div className="flex gap-0.5 sm:gap-1">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-primary/20"></div>
                      <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-accent/20"></div>
                      <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-secondary/20"></div>
                    </div>
                    <span className="text-[9px] sm:text-xs font-medium text-foreground/60">
                      And More...
                    </span>
                  </div>
                </div>

                {/* Overlay Label */}
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-foreground/80">
                    Events Near You
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {[0, 1].map((index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActiveSlide(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeSlide === index
                ? "w-8 bg-primary"
                : "w-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;
