"use client";

import React from "react";
import { Award, Star1, Ticket, Medal } from "iconsax-react";

interface LeaderboardProps {
  type: "attendees" | "trivia";
}

const Leaderboard: React.FC<LeaderboardProps> = ({ type }) => {
  const attendeesLeaderboard = [
    { rank: 1, name: "Alex Carter", score: 47, badge: "🥇" },
    { rank: 2, name: "Sarah Johnson", score: 42, badge: "🥈" },
    { rank: 3, name: "Michael Chen", score: 38, badge: "🥉" },
    { rank: 4, name: "Emma Williams", score: 35 },
    { rank: 5, name: "David Brown", score: 32 },
  ];

  const triviaLeaderboard = [
    { rank: 1, name: "Lisa Anderson", score: 2840, badge: "🥇" },
    { rank: 2, name: "James Wilson", score: 2650, badge: "🥈" },
    { rank: 3, name: "Maria Garcia", score: 2420, badge: "🥉" },
    { rank: 4, name: "Robert Taylor", score: 2180 },
    { rank: 5, name: "Jennifer Lee", score: 1950 },
  ];

  const currentLeaderboard = type === "attendees" ? attendeesLeaderboard : triviaLeaderboard;
  const title = type === "attendees" ? "Top Event Goers" : "Trivia Masters";
  const icon = type === "attendees" ? Ticket : Award;
  const scoreLabel = type === "attendees" ? "Events" : "Points";

  const IconComponent = icon;

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center">
                <IconComponent size={32} color="currentColor" variant="Bold" className="text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                {title}
              </h2>
            </div>
            <p className="text-foreground/70 text-lg">Monthly Leaderboard</p>
          </div>

          {/* Leaderboard List */}
          <div className="bg-background border border-foreground/10 rounded-2xl p-6 lg:p-8 mb-8">
            <div className="space-y-3">
              {currentLeaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 ${
                    entry.rank <= 3
                      ? "bg-primary/10 border-2 border-primary/30"
                      : "bg-foreground/5 border border-foreground/10 hover:bg-foreground/10"
                  }`}
                >
                  {/* Rank */}
                  <div className={`flex items-center justify-center w-14 h-14 rounded-2xl font-bold text-xl ${
                    entry.rank <= 3 
                      ? "bg-primary/20 text-primary" 
                      : "bg-foreground/10 text-foreground/70"
                  }`}>
                    {entry.badge || entry.rank}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">{entry.name}</h3>
                    {entry.rank <= 3 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star1 size={14} color="currentColor" variant="Bold" className="text-primary" />
                        <span className="text-xs text-primary font-semibold">Top Performer</span>
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary mb-1">{entry.score}</div>
                    <div className="text-xs text-foreground/60 font-medium">{scoreLabel}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Shop Teaser */}
          <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-4">
              <Medal size={32} color="currentColor" variant="Bold" className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
              Rewards Shop
            </h3>
            <p className="text-foreground/70 mb-6 max-w-md mx-auto">
              Redeem your points for exclusive perks and discounts
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="px-5 py-3 bg-background border border-foreground/10 rounded-2xl">
                <span className="font-bold text-primary text-lg">1000 pts</span>
                <span className="text-foreground/70 ml-2">= 10% off ticket</span>
              </div>
              <div className="px-5 py-3 bg-background border border-foreground/10 rounded-2xl">
                <span className="font-bold text-primary text-lg">5000 pts</span>
                <span className="text-foreground/70 ml-2">= Free event pass</span>
              </div>
              <div className="px-5 py-3 bg-background border border-foreground/10 rounded-2xl">
                <span className="font-bold text-primary text-lg">10000 pts</span>
                <span className="text-foreground/70 ml-2">= VIP upgrade</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
