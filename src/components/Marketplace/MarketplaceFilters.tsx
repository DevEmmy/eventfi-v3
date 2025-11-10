"use client";

import React from "react";

interface MarketplaceFiltersProps {
  selectedCategory: string;
  selectedLocation: string;
  selectedRating: string;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
  onRatingChange: (rating: string) => void;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  selectedCategory,
  selectedLocation,
  selectedRating,
  onCategoryChange,
  onLocationChange,
  onRatingChange,
}) => {
  const categories = [
    "All",
    "Photography",
    "Videography",
    "DJ & Music",
    "Catering",
    "Venues",
    "Decorations",
    "Security",
    "Lighting",
    "Sound System",
  ];

  const locations = ["All", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"];

  const ratings = ["All", "4.5+", "4.0+", "3.5+", "3.0+"];

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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.toLowerCase() ||
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

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Location
              </label>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() =>
                      onLocationChange(location === "All" ? "all" : location)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedLocation === location.toLowerCase() ||
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

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Minimum Rating
              </label>
              <div className="flex flex-wrap gap-2">
                {ratings.map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      onRatingChange(rating === "All" ? "all" : rating)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedRating === rating.toLowerCase() ||
                      (rating === "All" && selectedRating === "all")
                        ? "bg-primary text-white"
                        : "bg-foreground/5 text-foreground/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFilters;

