"use client";

import React from "react";
import {
  MusicPlaylist,
  Microphone2,
  People,
  Game,
} from "iconsax-react";

const PerfectForSection = () => {
  const eventTypes = [
    {
      icon: MusicPlaylist,
      title: "Concerts & Parties",
      description: "Music festivals, nightlife events, and celebrations",
      color: "primary",
    },
    {
      icon: Microphone2,
      title: "Conferences & Seminars",
      description: "Professional gatherings and educational events",
      color: "secondary",
    },
    {
      icon: People,
      title: "Meetups & Workshops",
      description: "Community gatherings and skill-building sessions",
      color: "accent",
    },
    {
      icon: Game,
      title: "Gaming Tournaments",
      description: "Competitive gaming events and esports",
      color: "primary",
    },
  ];

  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
      border: "border-primary/20",
    },
    secondary: {
      bg: "bg-secondary/10",
      icon: "text-secondary",
      border: "border-secondary/20",
    },
    accent: {
      bg: "bg-accent/10",
      icon: "text-accent",
      border: "border-accent/20",
    },
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Built for Events of All Sizes
          </h2>
          <p className="text-lg lg:text-xl text-foreground/70">
            Perfect for every occasion, from intimate workshops to large-scale festivals
          </p>
        </div>

        {/* Event Types Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {eventTypes.map((eventType, index) => {
            const IconComponent = eventType.icon;
            const colors =
              colorClasses[eventType.color as keyof typeof colorClasses];

            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center p-6 rounded-2xl border border-foreground/10 hover:border-foreground/20 transition-all duration-300 hover:shadow-lg bg-background"
              >
                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-2xl ${colors.bg} border-2 ${colors.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent
                    size={40}
                    color="currentColor"
                    variant="Bold"
                    className={colors.icon}
                  />
                </div>

                {/* Content */}
                <h3 className="text-lg lg:text-xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
                  {eventType.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {eventType.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PerfectForSection;

