"use client";

import React, { useState } from "react";
import { MessageText1, Image as ImageIcon, User, Wallet3, ArrowRight2, Like1, Message2 } from "iconsax-react";
import Button from "@/components/Button";

interface DiscussionHubsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const DiscussionHubs: React.FC<DiscussionHubsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const categories = [
    {
      id: "recaps",
      label: "Event Recaps & Photos",
      icon: ImageIcon,
      description: "Share your event experiences",
      color: "primary",
    },
    {
      id: "support",
      label: "Organizer Support",
      icon: User,
      description: "Tips and advice for hosts",
      color: "secondary",
    },
    {
      id: "lounge",
      label: "General Lounge",
      icon: MessageText1,
      description: "Casual chat and networking",
      color: "accent",
    },
    {
      id: "token",
      label: "Token Holders",
      icon: Wallet3,
      description: "Exclusive Web3 community",
      color: "primary",
      comingSoon: true,
    },
  ];

  const discussions = {
    recaps: [
      {
        id: 1,
        title: "Tech Fest Lagos 2024 - Amazing Experience!",
        author: "Alex Carter",
        time: "2 hours ago",
        replies: 24,
        likes: 156,
        image: true,
      },
      {
        id: 2,
        title: "DevFest Lagos Photo Dump 📸",
        author: "Sarah Johnson",
        time: "5 hours ago",
        replies: 18,
        likes: 89,
        image: true,
      },
      {
        id: 3,
        title: "Startup Summit Highlights",
        author: "Michael Chen",
        time: "1 day ago",
        replies: 32,
        likes: 201,
        image: true,
      },
    ],
    support: [
      {
        id: 1,
        title: "Best vendors for corporate events in Lagos?",
        author: "Michael Chen",
        time: "1 hour ago",
        replies: 12,
        likes: 34,
        image: false,
      },
      {
        id: 2,
        title: "How to increase ticket sales - Tips needed",
        author: "Emma Williams",
        time: "3 hours ago",
        replies: 8,
        likes: 22,
        image: false,
      },
      {
        id: 3,
        title: "Event promotion strategies that work",
        author: "David Brown",
        time: "5 hours ago",
        replies: 15,
        likes: 45,
        image: false,
      },
    ],
    lounge: [
      {
        id: 1,
        title: "Looking for event buddies in Abuja",
        author: "David Brown",
        time: "30 minutes ago",
        replies: 5,
        likes: 12,
        image: false,
      },
      {
        id: 2,
        title: "Upcoming events this weekend?",
        author: "Lisa Anderson",
        time: "1 hour ago",
        replies: 15,
        likes: 28,
        image: false,
      },
      {
        id: 3,
        title: "Best networking tips for events",
        author: "Robert Taylor",
        time: "2 hours ago",
        replies: 9,
        likes: 19,
        image: false,
      },
    ],
    token: [
      {
        id: 1,
        title: "Coming Soon: Web3 Governance",
        author: "EventFi Team",
        time: "Coming soon",
        replies: 0,
        likes: 0,
        image: false,
      },
    ],
  };

  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      text: "text-primary",
    },
    secondary: {
      bg: "bg-secondary/10",
      border: "border-secondary/30",
      text: "text-secondary",
    },
    accent: {
      bg: "bg-accent/10",
      border: "border-accent/30",
      text: "text-accent",
    },
  };

  const currentDiscussions = discussions[activeCategory as keyof typeof discussions] || [];

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-3 text-foreground">
              Discussion Hubs
            </h2>
            <p className="text-foreground/70 text-lg">Join conversations and share your experiences</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const colors = colorClasses[category.color as keyof typeof colorClasses];
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => !category.comingSoon && onCategoryChange(category.id)}
                  disabled={category.comingSoon}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border font-semibold transition-all duration-300 ${
                    isActive
                      ? `${colors.bg} ${colors.border} ${colors.text} border-2`
                      : "border-foreground/10 text-foreground/70 hover:border-primary/30 hover:text-primary bg-background"
                  } ${category.comingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <IconComponent size={20} color="currentColor" variant={isActive ? "Bold" : "Outline"} />
                  <span>{category.label}</span>
                  {category.comingSoon && (
                    <span className="text-xs px-2.5 py-1 bg-foreground/5 rounded-full font-medium">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Discussions List */}
          <div className="space-y-4 mb-8">
            {currentDiscussions.map((discussion) => (
              <div
                key={discussion.id}
                className="group bg-background border border-foreground/10 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Discussion Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground group-hover:text-primary transition-colors pr-4">
                        {discussion.title}
                      </h3>
                      {discussion.image && (
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center">
                          <ImageIcon
                            size={24}
                            color="currentColor"
                            variant="Bold"
                            className="text-primary"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
                      <span className="font-medium">by {discussion.author}</span>
                      <span>•</span>
                      <span>{discussion.time}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Message2 size={18} color="currentColor" variant="Outline" />
                        <span className="font-medium">{discussion.replies}</span>
                        <span className="text-foreground/50">replies</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Like1 size={18} color="currentColor" variant="Outline" />
                        <span className="font-medium">{discussion.likes}</span>
                        <span className="text-foreground/50">likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create New Post Button */}
          <div className="flex justify-center">
            <Button variant="primary" size="lg" rightIcon={ArrowRight2} className="px-8">
              Start a Discussion
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscussionHubs;
