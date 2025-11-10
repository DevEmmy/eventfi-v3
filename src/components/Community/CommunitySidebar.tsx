"use client";

import React from "react";
import { User, Calendar, Star1, TickCircle } from "iconsax-react";

interface CommunitySidebarProps {}

const CommunitySidebar: React.FC<CommunitySidebarProps> = () => {
  const suggestedFollows = [
    {
      name: "Tech Events Nigeria",
      role: "Organizer",
      followers: "2.5k",
      verified: true,
    },
    {
      name: "Elite Photography",
      role: "Vendor",
      followers: "1.8k",
      verified: true,
    },
    {
      name: "Alex Carter",
      role: "Event Goer",
      followers: "890",
      verified: false,
    },
  ];

  const upcomingCalls = [
    {
      title: "Community Town Hall",
      date: "March 25, 2024",
      time: "6:00 PM",
      type: "Virtual",
    },
    {
      title: "Organizer Meetup",
      date: "April 5, 2024",
      time: "2:00 PM",
      type: "In-Person",
    },
  ];

  return (
    <aside className="space-y-6">
      {/* Who to Follow */}
      <div className="bg-background border border-foreground/10 rounded-2xl p-4">
        <h3 className="text-lg font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
          Who to Follow
        </h3>
        <div className="hidden md:block space-y-3">
          {suggestedFollows.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-all duration-200 cursor-pointer border border-foreground/5 hover:border-foreground/10"
            >
              <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                <User size={18} color="currentColor" variant="Bold" className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-semibold text-foreground text-sm truncate">
                    {user.name}
                  </span>
                  {user.verified && (
                    <TickCircle
                      size={13}
                      color="currentColor"
                      variant="Bold"
                      className="text-primary shrink-0"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                  <span className="truncate">{user.role}</span>
                  <span className="text-foreground/40">•</span>
                  <span className="truncate">{user.followers} followers</span>
                </div>
              </div>
              <button className="px-4 py-1.5 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0 whitespace-nowrap">
                Follow
              </button>
            </div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:hidden scrollbar-hide">
          {suggestedFollows.map((user, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-foreground/5 rounded-xl border border-foreground/5 shrink-0 w-[140px]"
            >
              <div className="w-14 h-14 rounded-full bg-foreground/5 flex items-center justify-center">
                <User size={28} color="currentColor" variant="Bold" className="text-primary" />
              </div>
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground text-xs text-center truncate w-full">
                    {user.name}
                  </span>
                  {user.verified && (
                    <TickCircle
                      size={12}
                      color="currentColor"
                      variant="Bold"
                      className="text-primary shrink-0"
                    />
                  )}
                </div>
                <span className="text-xs text-foreground/60 text-center">{user.role}</span>
                <span className="text-xs text-foreground/50 text-center">{user.followers} followers</span>
              </div>
              <button className="w-full px-3 py-1.5 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors mt-1">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Community Calls */}
      <div className="bg-background border border-foreground/10 rounded-2xl p-4">
        <h3 className="text-lg font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
          Upcoming Community Calls
        </h3>
        <div className="space-y-4">
          {upcomingCalls.map((call, index) => (
            <div
              key={index}
              className="p-4 bg-foreground/5 rounded-xl border border-foreground/10"
            >
              <h4 className="font-semibold text-foreground mb-2">{call.title}</h4>
              <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2">
                <Calendar size={16} color="currentColor" variant="Outline" />
                <span>{call.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">{call.time}</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {call.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CommunitySidebar;
