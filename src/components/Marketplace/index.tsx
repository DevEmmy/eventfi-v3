"use client";

import React, { useState, useEffect, useCallback } from "react";
import MarketplaceHero from "./MarketplaceHero";
import MarketplaceFilters from "./MarketplaceFilters";
import VendorsList from "./VendorsList";
import EmptyState from "./EmptyState";
import { VendorCardProps } from "./VendorCard";
import { VendorService, VendorProfile } from "@/services/vendor";

// Map backend category enums to display names
const categoryDisplayMap: Record<string, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  DJ_MUSIC: "DJ & Music",
  CATERING: "Catering",
  VENUES: "Venues",
  DECORATIONS: "Decorations",
  SECURITY: "Security",
  LIGHTING: "Lighting",
  SOUND_SYSTEM: "Sound System",
  OTHER: "Other",
};

// Map display names back to enum values for API calls
const categoryApiMap: Record<string, string> = Object.fromEntries(
  Object.entries(categoryDisplayMap).map(([k, v]) => [v, k])
);

const mapVendorToCard = (vendor: VendorProfile): VendorCardProps => {
  const priceRange =
    vendor.priceMin && vendor.priceMax
      ? `₦${vendor.priceMin.toLocaleString()} - ₦${vendor.priceMax.toLocaleString()}`
      : vendor.priceMin
        ? `From ₦${vendor.priceMin.toLocaleString()}`
        : "Contact for pricing";

  return {
    id: vendor.id,
    name: vendor.name,
    category: categoryDisplayMap[vendor.category] || vendor.category,
    location: vendor.location,
    rating: vendor.averageRating,
    reviewCount: vendor.reviewCount,
    priceRange,
    verified: vendor.isVerified,
    image: vendor.coverImage || vendor.logo || undefined,
    specialties: vendor.specialties,
  };
};

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");

  const [vendors, setVendors] = useState<VendorCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 12 };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== "all") {
        params.category = categoryApiMap[selectedCategory] || selectedCategory;
      }
      if (selectedLocation !== "all") params.location = selectedLocation;
      if (selectedRating !== "all") {
        params.minRating = parseFloat(selectedRating.replace("+", ""));
      }

      const result = await VendorService.list(params);
      setVendors(result.data.map(mapVendorToCard));
      setTotalPages(result.meta.totalPages);
    } catch {
      // Silently fail - show empty state
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategory, selectedLocation, selectedRating]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedLocation, selectedRating]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedRating("all");
    setPage(1);
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

      {loading ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-background border border-foreground/10 rounded-2xl p-4 animate-pulse">
                <div className="h-40 bg-foreground/10 rounded-xl mb-4" />
                <div className="h-5 w-3/4 bg-foreground/10 rounded mb-2" />
                <div className="h-4 w-1/2 bg-foreground/5 rounded mb-4" />
                <div className="h-4 w-full bg-foreground/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : vendors.length > 0 ? (
        <VendorsList
          vendors={vendors}
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
