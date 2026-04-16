"use client";

import React from "react";
import SearchBar from "../SearchBar";
import { MapPin, CalendarBlank, Funnel } from '@phosphor-icons/react';

const SearchSection = () => {
  return (
    <section className="py-12 lg:py-16 bg-background ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold  mb-3 text-foreground">
              Find Your Next Event
            </h2>
            <p className="text-foreground/60 text-lg">
              Search by event name, location, or category
            </p>
          </div>

          {/* Main Search Bar */}
          <div className="mb-6">
            <SearchBar 
              placeholder="Search events, locations, or categories..." 
              className="w-full"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.location.href = "/explore-events"}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-200 text-sm font-medium"
            >
              <MapPin size={18} color="currentColor" weight="regular" />
              <span>Near Me</span>
            </button>
            <button
              onClick={() => window.location.href = "/explore-events"}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-200 text-sm font-medium"
            >
              <CalendarBlank size={18} color="currentColor" weight="regular" />
              <span>This Week</span>
            </button>
            <button
              onClick={() => window.location.href = "/explore-events"}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-200 text-sm font-medium"
            >
              <Funnel size={18} color="currentColor" weight="regular" />
              <span>All Filters</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;

