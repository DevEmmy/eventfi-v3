"use client";

import React from "react";
import Button from "@/components/Button";
import { Ticket, CalendarAdd, Briefcase, ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";

const RoleSelectionStep = () => {
  const router = useRouter();

  const handleSkip = () => {
    // Default to Attendee role and redirect to home
    // Set role to Attendee
    router.push("/");
  };

  const handleRoleSelect = (role: "attendee" | "organizer" | "vendor") => {
    // Set user role
    console.log(`Selected role: ${role}`);

    switch (role) {
      case "attendee":
        router.push("/");
        break;
      case "organizer":
        router.push("/profile?tab=dashboard");
        break;
      case "vendor":
        router.push("/vendor/profile");
        break;
    }
  };

  const roles = [
    {
      id: "attendee",
      icon: Ticket,
      emoji: "🎉",
      title: "Find & Attend Events",
      description:
        "I want to discover experiences, book tickets, and earn rewards.",
      color: "primary",
    },
    {
      id: "organizer",
      icon: CalendarAdd,
      emoji: "📅",
      title: "Organize an Event",
      description:
        "I'm planning an event and need ticketing and management tools.",
      color: "secondary",
    },
    {
      id: "vendor",
      icon: Briefcase,
      emoji: "💼",
      title: "Offer My Services",
      description:
        "I'm a DJ, photographer, or venue owner looking for bookings.",
      color: "accent",
    },
  ];

  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      border: "border-primary/20",
      hover: "hover:border-primary/40",
      icon: "text-primary",
    },
    secondary: {
      bg: "bg-secondary/10",
      border: "border-secondary/20",
      hover: "hover:border-secondary/40",
      icon: "text-secondary",
    },
    accent: {
      bg: "bg-accent/10",
      border: "border-accent/20",
      hover: "hover:border-accent/40",
      icon: "text-accent",
    },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Skip Button */}
        <div className="text-right mb-8">
          <button
            onClick={handleSkip}
            className="text-sm text-foreground/70 hover:text-primary transition-colors font-medium"
          >
            Skip and Browse Events &gt;
          </button>
        </div>

        {/* Card */}
        <div className="bg-background border-2 border-foreground/10 rounded-2xl p-8 lg:p-12 shadow-xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-3 text-foreground">
              How will you use EventFi primarily?
            </h2>
            <p className="text-lg text-foreground/70">
              Don't worry, you can do it all from one account later.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {roles.map((role) => {
              const IconComponent = role.icon;
              const colors =
                colorClasses[role.color as keyof typeof colorClasses];

              return (
                <button
                  key={role.id}
                  onClick={() =>
                    handleRoleSelect(
                      role.id as "attendee" | "organizer" | "vendor"
                    )
                  }
                  className={`group relative p-6 lg:p-8 rounded-2xl border-2 ${colors.border} ${colors.hover} ${colors.bg} transition-all duration-300 hover:shadow-xl text-left`}
                >
                  {/* Emoji */}
                  <div className="text-5xl mb-4">{role.emoji}</div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl ${colors.bg} border-2 ${colors.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent
                        size={32}
                        color="currentColor"
                        variant="Bold"
                        className={colors.icon}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Arrow Indicator */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight2
                      size={24}
                      color="currentColor"
                      variant="Outline"
                      className={colors.icon}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionStep;

