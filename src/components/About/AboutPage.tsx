"use client";

import React from "react";
import Button from "@/components/Button";
import { ArrowRight2, TickCircle, User, Calendar, Shop, Game } from "iconsax-react";

const AboutPage = () => {
  const stats = [
    { label: "Active Users", value: "10K+", icon: User },
    { label: "Events Hosted", value: "500+", icon: Calendar },
    { label: "Verified Vendors", value: "200+", icon: Shop },
    { label: "Events Attended", value: "50K+", icon: Game },
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We're constantly pushing boundaries to make event management seamless and engaging.",
      icon: TickCircle,
    },
    {
      title: "Community Driven",
      description: "Built by organizers, for organizers. Your feedback shapes our platform.",
      icon: User,
    },
    {
      title: "Trust & Security",
      description: "Verified vendors, secure payments, and reliable support you can count on.",
      icon: TickCircle,
    },
    {
      title: "Accessibility",
      description: "Events should be accessible to everyone, regardless of size or budget.",
      icon: TickCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-foreground">
              About EventFi
            </h1>
            <p className="text-xl lg:text-2xl text-foreground/70 mb-8 leading-relaxed">
              We're building the future of event management—one seamless experience at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-6 text-foreground">
              Our Mission
            </h2>
            <div className="space-y-6 text-lg text-foreground/70 leading-relaxed">
              <p>
                EventFi was born from a simple observation: organizing events shouldn't require juggling multiple tools, unreliable vendors, or disconnected experiences. We believe every event—from intimate meetups to large conferences—deserves professional-grade tools that are accessible, intuitive, and powerful.
              </p>
              <p>
                Our mission is to empower organizers with an all-in-one platform that handles everything from ticketing and vendor bookings to in-event engagement, while creating unforgettable experiences for attendees through gamification, rewards, and seamless discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                EventFi by the Numbers
              </h2>
              <p className="text-lg lg:text-xl text-foreground/70">
                Growing together, one event at a time
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                const colors = [
                  { bg: "bg-primary/10", border: "border-primary/20", icon: "text-primary" },
                  { bg: "bg-secondary/10", border: "border-secondary/20", icon: "text-secondary" },
                  { bg: "bg-accent/10", border: "border-accent/20", icon: "text-accent" },
                  { bg: "bg-primary/10", border: "border-primary/20", icon: "text-primary" },
                ];
                const colorSet = colors[index % colors.length];
                
                return (
                  <div
                    key={index}
                    className={`group flex flex-col items-center text-center p-6 lg:p-8 rounded-2xl border-2 ${colorSet.border} hover:border-foreground/30 transition-all duration-300 bg-background`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-20 h-20 rounded-2xl ${colorSet.bg} border-2 ${colorSet.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent
                        size={40}
                        color="currentColor"
                        variant="Bold"
                        className={colorSet.icon}
                      />
                    </div>

                    {/* Value */}
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                      {stat.value}
                    </h2>
                    
                    {/* Label */}
                    <div className="text-sm lg:text-base text-foreground/70 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-12 text-center text-foreground">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-background border border-foreground/10 rounded-2xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <IconComponent
                          size={24}
                          color="currentColor"
                          variant="Bold"
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
                          {value.title}
                        </h3>
                        <p className="text-foreground/70 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24 bg-foreground/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-6 text-foreground">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-foreground/70 leading-relaxed">
              <p>
                EventFi started in 2024 when a group of event organizers and tech enthusiasts came together with a shared frustration: the event management landscape was fragmented, expensive, and unnecessarily complex.
              </p>
              <p>
                After organizing hundreds of events between us—from tech meetups to music festivals—we knew there had to be a better way. We envisioned a platform that would bring together ticketing, vendor management, attendee engagement, and community building under one roof.
              </p>
              <p>
                Today, EventFi serves organizers across Nigeria and beyond, helping them create memorable events while building a vibrant community of event-goers, vendors, and creators. We're just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Join Us on This Journey
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Whether you're an organizer, attendee, or vendor, there's a place for you in the EventFi community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" rightIcon={ArrowRight2}>
                Get Started
              </Button>
              <Button variant="outline" size="lg" rightIcon={ArrowRight2}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

