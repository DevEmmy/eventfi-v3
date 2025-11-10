"use client";

import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { Filter, Location as LocationIcon, Star1 } from "iconsax-react";

interface MarketplaceHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
}) => {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Vendor Marketplace
          </h1>
          <p className="text-lg lg:text-xl text-foreground/70 mb-8">
            Find verified vendors for your next event
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar
              placeholder="Search vendors, services, or locations..."
              className="w-full"
              onSearch={onSearchChange}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium transition-all duration-200 ${
                showFilters
                  ? "border-primary text-primary bg-primary/10"
                  : "border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary"
              }`}
            >
              <Filter size={18} color="currentColor" variant="Outline" />
              <span>Filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-200 font-medium">
              <LocationIcon size={18} color="currentColor" variant="Outline" />
              <span>Near Me</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-200 font-medium">
              <Star1 size={18} color="currentColor" variant="Outline" />
              <span>Top Rated</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceHero;

