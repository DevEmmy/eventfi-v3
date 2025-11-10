"use client";

import React, { useState } from "react";
import CommunityHero from "./CommunityHero";
import DiscussionHubs from "./DiscussionHubs";
import Leaderboard from "./Leaderboard";
import LostAndFound from "./LostAndFound";
import CommunitySidebar from "./CommunitySidebar";

const CommunityPage = () => {
  const [activeCategory, setActiveCategory] = useState("recaps");
  const [leaderboardType, setLeaderboardType] = useState<"attendees" | "trivia">("attendees");

  const trendingActivities = [
    "Trending: Tech Fest Lagos is heating up 🔥",
    "@Alex just won the trivia challenge at DevMeetup",
    "New discussion: Best venues in Abuja?",
    "Sarah shared amazing photos from Startup Summit",
    "Lost & Found: 3 items reunited this week!",
  ];

  return (
    <div className="min-h-screen bg-background">
      <CommunityHero trendingActivities={trendingActivities} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8 lg:gap-5">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            <DiscussionHubs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Leaderboard Section */}
            <div>
              {/* Leaderboard Toggle */}
              <div className="flex justify-center gap-3 mb-8">
                <button
                  onClick={() => setLeaderboardType("attendees")}
                  className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    leaderboardType === "attendees"
                      ? "bg-primary text-white"
                      : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-primary border border-foreground/10"
                  }`}
                >
                  Top Event Goers
                </button>
                <button
                  onClick={() => setLeaderboardType("trivia")}
                  className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    leaderboardType === "trivia"
                      ? "bg-primary text-white"
                      : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-primary border border-foreground/10"
                  }`}
                >
                  Trivia Masters
                </button>
              </div>

              <Leaderboard type={leaderboardType} />
            </div>

            <LostAndFound />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CommunitySidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
