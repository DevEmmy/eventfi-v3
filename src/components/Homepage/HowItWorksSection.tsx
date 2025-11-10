"use client";

import React from "react";
import {
  DocumentText,
  Shop,
  PlayCircle,
  ArrowRight2,
} from "iconsax-react";
import Button from "../Button";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Create & Customize",
      description:
        "Set up your event page, define ticket tiers, and add your brand colors—no coding needed.",
      icon: DocumentText,
      color: "primary",
    },
    {
      number: "02",
      title: "Connect Vendors (Optional)",
      description:
        "Need a DJ or a photographer? Browse our vetted marketplace and book them in one click.",
      icon: Shop,
      color: "secondary",
    },
    {
      number: "03",
      title: "Go Live & Engage",
      description:
        "Publish your event, track real-time sales, and use our in-app games to wow your attendees.",
      icon: PlayCircle,
      color: "accent",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Launch Your Next Event in Minutes
          </h2>
          <p className="text-lg lg:text-xl text-foreground/70">
            Three simple steps to get your event up and running
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting Line - Desktop Only */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -z-10"></div>

            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const colorClasses = {
                primary: {
                  bg: "bg-primary/10",
                  icon: "text-primary",
                  border: "border-primary/20",
                  number: "text-primary",
                },
                secondary: {
                  bg: "bg-secondary/10",
                  icon: "text-secondary",
                  border: "border-secondary/20",
                  number: "text-secondary",
                },
                accent: {
                  bg: "bg-accent/10",
                  icon: "text-accent",
                  border: "border-accent/20",
                  number: "text-accent",
                },
              };

              const colors = colorClasses[step.color as keyof typeof colorClasses];

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step Number Badge */}
                  <div
                    className={`w-32 h-32 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconComponent
                        size={40}
                        color="currentColor"
                        variant="Bold"
                        className={colors.icon}
                      />
                    </div>
                    {/* Step Number */}
                    <span
                      className={`text-2xl font-bold font-[family-name:var(--font-clash-display)] ${colors.number} opacity-20`}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-3 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow Connector - Desktop Only */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 -right-6 lg:-right-12 z-0">
                      <ArrowRight2
                        size={24}
                        color="currentColor"
                        variant="Outline"
                        className="text-foreground/20"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Button
              variant="primary"
              size="lg"
              rightIcon={ArrowRight2}
              iconVariant="Bold"
              onClick={() => {
                window.location.href = "#create-event";
              }}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

