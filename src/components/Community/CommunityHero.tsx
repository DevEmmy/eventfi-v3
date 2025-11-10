"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight2, Star1, Flash } from "iconsax-react";
import Button from "@/components/Button";

interface CommunityHeroProps {
  trendingActivities: string[];
}

const CommunityHero: React.FC<CommunityHeroProps> = ({ trendingActivities }) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % trendingActivities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [trendingActivities.length]);

  return (
    <section className="bg-background py-16 lg:py-20 border-b border-foreground/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full mb-6">
              <Flash size={20} color="currentColor" variant="Bold" className="text-primary" />
              <span className="text-sm font-semibold text-primary">Live Community</span>
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold font-[family-name:var(--font-clash-display)] mb-6 text-foreground">
              EventFi Community
            </h1>
            <p className="text-xl lg:text-2xl text-foreground/70 max-w-2xl mx-auto">
              Connect, share, and celebrate events together
            </p>
          </div>

          {/* Live Activity Ticker */}
          <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <h2 className="text-lg font-bold text-foreground">Live Activity</h2>
            </div>
            <div className="flex items-center gap-3 min-h-8">
              <p className="text-foreground/90 text-lg font-medium flex-1 transition-all duration-500">
                {trendingActivities[currentActivityIndex]}
              </p>
            </div>
          </div>

          {/* Featured Content */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Featured Post */}
            <div className="group bg-background border border-foreground/10 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-2 mb-4">
                <Star1 size={20} color="currentColor" variant="Bold" className="text-primary" />
                <span className="text-sm font-bold text-primary uppercase tracking-wide">Featured Post</span>
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-3 text-foreground group-hover:text-primary transition-colors">
                Best Event Photography Tips from Pros
              </h3>
              <p className="text-foreground/70 mb-6 line-clamp-2 leading-relaxed">
                Learn how to capture stunning moments at your events with tips from professional photographers...
              </p>
              <Button variant="ghost" size="md" rightIcon={ArrowRight2} className="group-hover:text-primary">
                Read More
              </Button>
            </div>

            {/* Host of the Month */}
            <div className="group bg-background border border-foreground/10 rounded-2xl p-8 hover:border-secondary/30 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-2 mb-4">
                <Star1 size={20} color="currentColor" variant="Bold" className="text-secondary" />
                <span className="text-sm font-bold text-secondary uppercase tracking-wide">Host of the Month</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-foreground/5 flex items-center justify-center">
                  <span className="text-4xl">👑</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-1">
                    Tech Events Nigeria
                  </h3>
                  <p className="text-sm text-foreground/60">15 events hosted this month</p>
                </div>
              </div>
              <Button variant="ghost" size="md" rightIcon={ArrowRight2} className="group-hover:text-secondary">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHero;
