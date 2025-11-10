"use client";

import React, { useState } from "react";
import { TickCircle, User, Calendar, Location } from "iconsax-react";
import Button from "@/components/Button";

interface LostAndFoundProps {}

const LostAndFound: React.FC<LostAndFoundProps> = () => {
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");

  const items = [
    {
      id: 1,
      type: "found",
      title: "Found: Black iPhone at Concert X",
      location: "Tech Fest Lagos",
      date: "2 days ago",
      status: "open",
      reporter: "Alex Carter",
      verified: true,
    },
    {
      id: 2,
      type: "lost",
      title: "Lost: Red Jacket at Venue Y",
      location: "DevFest Lagos",
      date: "1 day ago",
      status: "resolved",
      reporter: "Sarah Johnson",
      verified: true,
    },
    {
      id: 3,
      type: "found",
      title: "Found: Wallet with ID",
      location: "Startup Summit",
      date: "3 days ago",
      status: "open",
      reporter: "Michael Chen",
      verified: false,
    },
    {
      id: 4,
      type: "lost",
      title: "Lost: Blue Backpack",
      location: "Gaming Night Championship",
      date: "5 hours ago",
      status: "open",
      reporter: "Emma Williams",
      verified: true,
    },
  ];

  const filteredItems =
    filter === "all"
      ? items
      : items.filter((item) => item.type === filter);

  const goodSamaritans = [
    { name: "Alex Carter", returns: 12, verified: true },
    { name: "Sarah Johnson", returns: 8, verified: true },
    { name: "Michael Chen", returns: 5, verified: false },
  ];

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-foreground/5 rounded-full mb-4">
              <TickCircle size={20} color="currentColor" variant="Bold" className="text-secondary" />
              <span className="text-sm font-semibold text-secondary">Community Service</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-3 text-foreground">
              Lost & Found
            </h2>
            <p className="text-foreground/70 text-lg">
              Help reunite lost items with their owners
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-3 mb-10">
            {(["all", "lost", "found"] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 capitalize ${
                  filter === filterType
                    ? "bg-primary text-white"
                    : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-primary border border-foreground/10"
                }`}
              >
                {filterType === "all" ? "All Items" : filterType}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lost & Found Feed */}
            <div className="lg:col-span-2 space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-background border rounded-2xl p-6 transition-all duration-300 ${
                    item.type === "found"
                      ? "border-secondary/20 hover:border-secondary/40"
                      : "border-accent/20 hover:border-accent/40"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                            item.type === "found"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-accent/10 text-accent"
                          }`}
                        >
                          {item.type === "found" ? "Found" : "Lost"}
                        </span>
                        {item.status === "resolved" && (
                          <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-3">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 mb-4">
                        <div className="flex items-center gap-2">
                          <Location size={16} color="currentColor" variant="Outline" />
                          <span className="font-medium">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} color="currentColor" variant="Outline" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                          <User size={16} color="currentColor" variant="Bold" className="text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground/80">{item.reporter}</span>
                        {item.verified && (
                          <TickCircle
                            size={16}
                            color="currentColor"
                            variant="Bold"
                            className="text-primary"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant={item.type === "found" ? "secondary" : "outline"} 
                    size="md" 
                    className="w-full"
                  >
                    {item.type === "found" ? "Claim Item" : "I Found This"}
                  </Button>
                </div>
              ))}
            </div>

            {/* Good Samaritans Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-background border border-foreground/10 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  <TickCircle
                    size={24}
                    color="currentColor"
                    variant="Bold"
                    className="text-primary"
                  />
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                    Good Samaritans
                  </h3>
                </div>
                <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
                  Community members who have successfully returned items
                </p>
                <div className="space-y-3">
                  {goodSamaritans.map((samaritan, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-foreground/5 rounded-xl border border-foreground/10"
                    >
                      <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                        <User size={24} color="currentColor" variant="Bold" className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-foreground text-sm truncate">
                            {samaritan.name}
                          </span>
                          {samaritan.verified && (
                            <TickCircle
                              size={14}
                              color="currentColor"
                              variant="Bold"
                              className="text-primary shrink-0"
                            />
                          )}
                        </div>
                        <span className="text-xs text-foreground/60">
                          {samaritan.returns} successful returns
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LostAndFound;
