"use client";

import React from "react";
import VendorCard, { VendorCardProps } from "./VendorCard";
import { Grid3, RowVertical } from "iconsax-react";

interface VendorsListProps {
  vendors: VendorCardProps[];
  viewMode: "grid" | "list";
  searchQuery: string;
  onViewModeChange: (mode: "grid" | "list") => void;
}

const VendorsList: React.FC<VendorsListProps> = ({
  vendors,
  viewMode,
  searchQuery,
  onViewModeChange,
}) => {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
              {vendors.length} Vendors Found
            </h2>
            <p className="text-foreground/60 mt-1">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : "Browse verified vendors"}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-foreground/5 text-foreground/70 hover:bg-primary/10"
              }`}
              aria-label="Grid view"
            >
              <Grid3 size={20} color="currentColor" variant="Outline" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-foreground/5 text-foreground/70 hover:bg-primary/10"
              }`}
              aria-label="List view"
            >
              <RowVertical size={20} color="currentColor" variant="Outline" />
            </button>
          </div>
        </div>

        {/* Vendors Grid/List */}
        {vendors.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className={viewMode === "list" ? "max-w-4xl" : ""}
                onClick={() => {
                  window.location.href = `/marketplace/${vendor.id}`;
                }}
              >
                <VendorCard {...vendor} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default VendorsList;

