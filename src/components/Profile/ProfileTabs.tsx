"use client";

import React from "react";
import { Calendar, User, TickCircle } from "iconsax-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: {
    id: string;
    label: string;
    icon: React.ComponentType<{
      size?: number;
      color?: string;
      variant?: "Linear" | "Outline" | "Bold" | "Broken" | "Bulk" | "TwoTone";
    }>;
    count?: number;
  }[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
  tabs,
}) => {
  return (
    <div className="border-b border-foreground/10 bg-background sticky top-[73px] z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap
                    border-b-2 transition-colors
                    ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/20"
                    }
                  `}
                >
                  <IconComponent
                    size={20}
                    color="currentColor"
                    variant={isActive ? "Bold" : "Outline"}
                  />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`
                        px-2 py-0.5 rounded-full text-xs font-semibold
                        ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-foreground/5 text-foreground/60"
                        }
                      `}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;

