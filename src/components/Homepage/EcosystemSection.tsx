"use client";

import React from "react";
import {
  Monitor,
  Shop,
  Game,
  Ticket,
  TickCircle,
  Star1,
  Award,
} from "iconsax-react";

const EcosystemSection = () => {
  const features = [
    {
      title: "Seamless Ticketing & Management",
      description:
        "Create stunning event pages, manage diverse ticket tiers, and handle check-ins with our powerful organizer dashboard.",
      icon: Monitor,
      visual: "dashboard",
      gradient: "from-primary/10 via-primary/5 to-background",
      borderColor: "border-primary/20",
      hoverBorder: "hover:border-primary/40",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
    },
    {
      title: "Verified Vendor Marketplace",
      description:
        "Struggling to find reliable vendors? Browse, book, and pay verified photographers, caterers, and venues directly within the platform.",
      icon: Shop,
      visual: "marketplace",
      gradient: "from-secondary/10 via-secondary/5 to-background",
      borderColor: "border-secondary/20",
      hoverBorder: "hover:border-secondary/40",
      iconBg: "bg-secondary/20",
      iconColor: "text-secondary",
    },
    {
      title: "In-Event Gamification",
      description:
        "Keep your attendees glued to the experience. Host live quizzes, polls, and scavenger hunts with instant digital rewards.",
      icon: Game,
      visual: "gamification",
      gradient: "from-accent/10 via-accent/5 to-background",
      borderColor: "border-accent/20",
      hoverBorder: "hover:border-accent/40",
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Everything You Need to Run a Perfect Event
          </h2>
          <p className="text-lg lg:text-xl text-foreground/70 leading-relaxed">
            Say goodbye to using five different tools. EventFi brings your
            logistics, bookings, and attendee engagement under one roof.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 lg:p-8 border ${feature.borderColor} ${feature.hoverBorder} transition-all duration-300 hover:shadow-xl overflow-hidden`}
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-opacity-10 rounded-full blur-3xl -z-10"></div>

              {/* Icon */}
              <div className="mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    size={32}
                    color="currentColor"
                    variant="Bold"
                    className={feature.iconColor}
                  />
                </div>
              </div>

              {/* Visual Mockup */}
              <div className="mb-6 h-48 rounded-xl overflow-hidden bg-background/50 border border-foreground/10">
                {feature.visual === "dashboard" && (
                  <div className="h-full p-4 flex flex-col gap-3">
                    {/* Browser Bar */}
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                      <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                      <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                    </div>
                    {/* Dashboard Content */}
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <div className="h-2 bg-primary/30 rounded w-3/4 mb-1"></div>
                        <div className="h-1.5 bg-primary/20 rounded w-1/2"></div>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-2">
                        <div className="h-2 bg-primary/30 rounded w-3/4 mb-1"></div>
                        <div className="h-1.5 bg-primary/20 rounded w-1/2"></div>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-2 col-span-2">
                        <div className="h-2 bg-primary/30 rounded w-2/3 mb-1"></div>
                        <div className="h-1.5 bg-primary/20 rounded w-1/3"></div>
                      </div>
                    </div>
                    {/* Ticket Icon Overlay */}
                    <div className="absolute bottom-4 right-4">
                      <Ticket
                        size={24}
                        color="currentColor"
                        variant="Bold"
                        className="text-primary/40"
                      />
                    </div>
                  </div>
                )}

                {feature.visual === "marketplace" && (
                  <div className="h-full p-4 flex flex-col gap-3">
                    {/* Vendor Badges */}
                    <div className="flex gap-2 flex-wrap">
                      <div className="px-3 py-1.5 bg-secondary/20 rounded-lg flex items-center gap-2">
                        <Star1
                          size={14}
                          color="currentColor"
                          variant="Bold"
                          className="text-secondary"
                        />
                        <div className="h-1.5 bg-secondary/40 rounded w-12"></div>
                      </div>
                      <div className="px-3 py-1.5 bg-secondary/20 rounded-lg flex items-center gap-2">
                        <TickCircle
                          size={14}
                          color="currentColor"
                          variant="Bold"
                          className="text-secondary"
                        />
                        <div className="h-1.5 bg-secondary/40 rounded w-16"></div>
                      </div>
                      <div className="px-3 py-1.5 bg-secondary/20 rounded-lg flex items-center gap-2">
                        <Star1
                          size={14}
                          color="currentColor"
                          variant="Bold"
                          className="text-secondary"
                        />
                        <div className="h-1.5 bg-secondary/40 rounded w-14"></div>
                      </div>
                    </div>
                    {/* Vendor Grid */}
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="bg-secondary/10 rounded-lg flex items-center justify-center"
                        >
                          <Shop
                            size={20}
                            color="currentColor"
                            variant="Outline"
                            className="text-secondary/40"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {feature.visual === "gamification" && (
                  <div className="h-full p-4 flex flex-col gap-3 bg-gradient-to-b from-accent/10 to-background">
                    {/* Leaderboard Header */}
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-accent/30 rounded w-20"></div>
                      <Award
                        size={20}
                        color="currentColor"
                        variant="Bold"
                        className="text-accent/60"
                      />
                    </div>
                    {/* Leaderboard Items */}
                    <div className="flex-1 flex flex-col gap-2">
                      {[1, 2, 3].map((rank) => (
                        <div
                          key={rank}
                          className="flex items-center gap-2 bg-accent/10 rounded-lg p-2"
                        >
                          <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center text-xs font-bold text-accent">
                            {rank}
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-accent/30 rounded w-3/4 mb-1"></div>
                            <div className="h-1.5 bg-accent/20 rounded w-1/2"></div>
                          </div>
                          <div className="text-xs font-bold text-accent">
                            {rank === 1 ? "🏆" : rank === 2 ? "🥈" : "🥉"}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Winner Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-accent/20 rounded-full px-2 py-1 flex items-center gap-1">
                        <Award
                          size={16}
                          color="currentColor"
                          variant="Bold"
                          className="text-accent"
                        />
                        <span className="text-xs font-bold text-accent">Winner</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-5 transition-opacity duration-300 rounded-2xl -z-0"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;

