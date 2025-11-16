"use client";

import React from "react";
import Button from "@/components/Button";
import { CalendarAdd, Shop, Ticket, ArrowRight2 } from "iconsax-react";

interface QuickActionsProps {
  userRoles: string[];
  onCreateEvent?: () => void;
  onCreateVendor?: () => void;
  onViewTickets?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  userRoles,
  onCreateEvent,
  onCreateVendor,
  onViewTickets,
}) => {
  const actions = [
    {
      id: "create-event",
      label: "Create Event",
      description: "Host your next event",
      icon: CalendarAdd,
      color: "primary",
      onClick: onCreateEvent,
      visible: true,
    },
    {
      id: "create-vendor",
      label: userRoles.includes("vendor") ? "Manage Vendor Profile" : "Become a Vendor",
      description: userRoles.includes("vendor") ? "Update your vendor details" : "Offer your services",
      icon: Shop,
      color: "secondary",
      onClick: onCreateVendor,
      visible: true,
    },
    {
      id: "my-tickets",
      label: "My Tickets",
      description: "View your event tickets",
      icon: Ticket,
      color: "accent",
      onClick: onViewTickets,
      visible: true,
    },
  ];

  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      border: "border-primary/20",
      icon: "text-primary",
      hover: "hover:bg-primary/20 hover:border-primary/30",
    },
    secondary: {
      bg: "bg-secondary/10",
      border: "border-secondary/20",
      icon: "text-secondary",
      hover: "hover:bg-secondary/20 hover:border-secondary/30",
    },
    accent: {
      bg: "bg-accent/10",
      border: "border-accent/20",
      icon: "text-accent",
      hover: "hover:bg-accent/20 hover:border-accent/30",
    },
  };

  return (
    <div className="bg-background border border-foreground/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions
          .filter((action) => action.visible)
          .map((action) => {
            const IconComponent = action.icon;
            const colors = colorClasses[action.color as keyof typeof colorClasses];

            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`
                  group flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200
                  ${colors.bg} ${colors.border} ${colors.hover}
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <IconComponent
                      size={24}
                      color="currentColor"
                      variant="Bold"
                      className={colors.icon}
                    />
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{action.label}</h4>
                <p className="text-sm text-foreground/60 mb-3">{action.description}</p>
                <div className="flex items-center gap-1 text-sm font-medium mt-auto">
                  <span className={colors.icon}>Get started</span>
                  <ArrowRight2
                    size={16}
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
  );
};

export default QuickActions;


