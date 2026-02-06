"use client";

import React from "react";
import SearchBar from "@/components/SearchBar";
import { Filter, Location as LocationIcon, Calendar } from "iconsax-react";

interface ExploreHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const ExploreHero: React.FC<ExploreHeroProps> = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
}) => {
  return (
    <section className=" py-12 lg:py-16 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold  mb-4 text-foreground">
            Explore Events
          </h1>
          <p className="text-lg lg:text-xl text-foreground/70 mb-8">
            Discover amazing events happening near you
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar
              placeholder="Search events, locations, or categories..."
              className="w-full"
              onSearch={onSearchChange}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium transition-all duration-200 ${showFilters
                  ? "border-primary text-primary bg-primary/10"
                  : "border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary"
                }`}
            >
              <Filter size={18} color={showFilters ? "#3D5AFE" : "#171717B3"} variant="Outline" />
              <span>Filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-200 font-medium">
              <LocationIcon size={18} color="#171717B3" variant="Outline" />
              <span>Near Me</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-200 font-medium">
              <Calendar size={18} color="#171717B3" variant="Outline" />
              <span>This Week</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreHero;

