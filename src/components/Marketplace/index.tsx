"use client";

import React, { useState } from "react";
import MarketplaceHero from "./MarketplaceHero";
import MarketplaceFilters from "./MarketplaceFilters";
import VendorsList from "./VendorsList";
import EmptyState from "./EmptyState";
import { VendorCardProps } from "./VendorCard";

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");

  // Sample vendor data - Replace with actual API data
  const vendors: VendorCardProps[] = [
    {
      id: "1",
      name: "Elite Photography Studio",
      category: "Photography",
      location: "Lagos, Nigeria",
      rating: 4.8,
      reviewCount: 245,
      priceRange: "₦50,000 - ₦200,000",
      verified: true,
      specialties: ["Wedding", "Corporate", "Events"],
    },
    {
      id: "2",
      name: "SoundWave DJ Services",
      category: "DJ & Music",
      location: "Lagos, Nigeria",
      rating: 4.9,
      reviewCount: 189,
      priceRange: "₦30,000 - ₦150,000",
      verified: true,
      specialties: ["Parties", "Corporate", "Weddings"],
    },
    {
      id: "3",
      name: "Gourmet Catering Co.",
      category: "Catering",
      location: "Abuja, Nigeria",
      rating: 4.7,
      reviewCount: 312,
      priceRange: "₦80,000 - ₦500,000",
      verified: true,
      specialties: ["Corporate", "Weddings", "Private Events"],
    },
    {
      id: "4",
      name: "Grand Ballroom Venue",
      category: "Venues",
      location: "Lagos, Nigeria",
      rating: 4.6,
      reviewCount: 156,
      priceRange: "₦200,000 - ₦1,000,000",
      verified: true,
      specialties: ["Conferences", "Weddings", "Corporate"],
    },
    {
      id: "5",
      name: "Creative Decor Solutions",
      category: "Decorations",
      location: "Port Harcourt, Nigeria",
      rating: 4.5,
      reviewCount: 98,
      priceRange: "₦40,000 - ₦300,000",
      verified: false,
      specialties: ["Weddings", "Parties", "Corporate"],
    },
    {
      id: "6",
      name: "Pro Video Productions",
      category: "Videography",
      location: "Lagos, Nigeria",
      rating: 4.9,
      reviewCount: 201,
      priceRange: "₦100,000 - ₦400,000",
      verified: true,
      specialties: ["Corporate", "Events", "Documentaries"],
    },
    {
      id: "7",
      name: "SecureGuard Services",
      category: "Security",
      location: "Lagos, Nigeria",
      rating: 4.7,
      reviewCount: 134,
      priceRange: "₦25,000 - ₦100,000",
      verified: true,
      specialties: ["Events", "Corporate", "Private"],
    },
    {
      id: "8",
      name: "Light & Sound Masters",
      category: "Lighting",
      location: "Abuja, Nigeria",
      rating: 4.8,
      reviewCount: 167,
      priceRange: "₦60,000 - ₦250,000",
      verified: true,
      specialties: ["Concerts", "Corporate", "Events"],
    },
  ];

  // Filter vendors based on search and filters
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      searchQuery === "" ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.specialties?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || vendor.category === selectedCategory;

    const matchesLocation =
      selectedLocation === "all" ||
      vendor.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesRating =
      selectedRating === "all" ||
      vendor.rating >= parseFloat(selectedRating.replace("+", ""));

    return matchesSearch && matchesCategory && matchesLocation && matchesRating;
  });

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedRating("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <MarketplaceFilters
          selectedCategory={selectedCategory}
          selectedLocation={selectedLocation}
          selectedRating={selectedRating}
          onCategoryChange={setSelectedCategory}
          onLocationChange={setSelectedLocation}
          onRatingChange={setSelectedRating}
        />
      )}

      {filteredVendors.length > 0 ? (
        <VendorsList
          vendors={filteredVendors}
          viewMode={viewMode}
          searchQuery={searchQuery}
          onViewModeChange={setViewMode}
        />
      ) : (
        <EmptyState onClearFilters={handleClearFilters} />
      )}
    </div>
  );
};

export default MarketplacePage;

