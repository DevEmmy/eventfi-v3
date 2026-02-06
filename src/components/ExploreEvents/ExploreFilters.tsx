"use client";

import React from "react";
import { Location } from "iconsax-react";

interface ExploreFiltersProps {
  selectedCategory: string;
  selectedDate: string;
  selectedLocation: string;
  onCategoryChange: (category: string) => void;
  onDateChange: (date: string) => void;
  onLocationChange: (location: string) => void;
}

const ExploreFilters: React.FC<ExploreFiltersProps> = ({
  selectedCategory,
  selectedDate,
  selectedLocation,
  onCategoryChange,
  onDateChange,
  onLocationChange,
}) => {
  const categories = [
    "All",
    "Technology",
    "Music",
    "Business",
    "Gaming",
    "Arts",
    "Tech Meetup",
  ];

  const dateFilters = ["All", "Today", "This Week", "This Month", "Next Month"];

  const locations = ["All", "Lagos", "Abuja", "Port Harcourt", "Ibadan"];

  return (
    <div className="bg-background border-b border-foreground/10 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      onCategoryChange(category === "All" ? "all" : category)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.toLowerCase() ||
                        (category === "All" && selectedCategory === "all")
                        ? "bg-primary text-white"
                        : "bg-foreground/5 text-foreground/70 hover:bg-primary/10 hover:text-primary"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Date
              </label>
              <div className="flex flex-wrap gap-2">
                {dateFilters.map((date) => (
                  <button
                    key={date}
                    onClick={() =>
                      onDateChange(date === "All" ? "all" : date)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedDate === date.toLowerCase() ||
                        (date === "All" && selectedDate === "all")
                        ? "bg-primary text-white"
                        : "bg-foreground/5 text-foreground/70 hover:bg-primary/10 hover:text-primary"
                      }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Location
              </label>
              <div className="space-y-3">
                {/* Use Current Location */}
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          // In a real app, you'd reverse geocode and set location
                          alert("Location detected! Filtering events near you...");
                          onLocationChange("nearby");
                        },
                        () => {
                          alert("Unable to detect location. Please select manually.");
                        }
                      );
                    } else {
                      alert("Geolocation not supported by your browser.");
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Location size={18} color="currentColor" variant="Bold" />
                  Use My Location
                </button>

                {/* Location Pills */}
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() =>
                        onLocationChange(location === "All" ? "all" : location)
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedLocation === location.toLowerCase() ||
                          (location === "All" && selectedLocation === "all")
                          ? "bg-primary text-white"
                          : "bg-foreground/5 text-foreground/70 hover:bg-primary/10 hover:text-primary"
                        }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreFilters;

