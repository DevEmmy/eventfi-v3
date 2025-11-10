"use client";

import React from "react";
import Button from "@/components/Button";
import { Briefcase } from "iconsax-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <Briefcase
          size={64}
          color="currentColor"
          variant="Outline"
          className="text-foreground/30 mx-auto mb-4"
        />
        <h3 className="text-xl font-bold text-foreground mb-2">
          No vendors found
        </h3>
        <p className="text-foreground/60 mb-6">
          Try adjusting your search or filters to find more vendors.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;

