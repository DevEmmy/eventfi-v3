"use client";

import React from "react";
import Button from "@/components/Button";
import {
  Shop,
  TickCircle,
  Edit2,
  ArrowRight2,
  Location,
  Star1,
  Call,
  Sms,
  Global,
  MoneyRecive,
  Briefcase,
} from "iconsax-react";

interface VendorProfileSectionProps {
  hasVendorProfile: boolean;
  vendorData?: {
    name: string;
    category: string;
    rating: number;
    reviews: number;
    isVerified: boolean;
    description: string;
    location?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    priceRange?: string;
    specialties?: string[];
    coverImage?: string;
    logo?: string;
    portfolio?: string[];
    availability?: "available" | "limited" | "unavailable";
    yearsOfExperience?: string;
  };
  onCreateVendor?: () => void;
  onEditVendor?: () => void;
  onViewVendor?: () => void;
}

const VendorProfileSection: React.FC<VendorProfileSectionProps> = ({
  hasVendorProfile,
  vendorData,
  onCreateVendor,
  onEditVendor,
  onViewVendor,
}) => {
  if (!hasVendorProfile) {
    return (
      <div className="bg-background border border-foreground/10 rounded-2xl p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
            <Shop
              size={32}
              color="currentColor"
              variant="Bold"
              className="text-secondary"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
              Become a Vendor
            </h3>
            <p className="text-foreground/70 mb-4 leading-relaxed">
              Offer your services to event organizers. Whether you're a photographer, caterer, DJ, or venue owner, 
              join our marketplace and get discovered by event organizers.
            </p>
            <Button
              variant="primary"
              size="md"
              leftIcon={Shop}
              rightIcon={ArrowRight2}
              onClick={onCreateVendor}
            >
              Create Vendor Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const availabilityLabels = {
    available: "Available",
    limited: "Limited Availability",
    unavailable: "Unavailable",
  };

  const availabilityColors = {
    available: "text-green-600 bg-green-50",
    limited: "text-yellow-600 bg-yellow-50",
    unavailable: "text-red-600 bg-red-50",
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-background border border-foreground/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            {vendorData?.logo ? (
              <img
                src={vendorData.logo}
                alt={vendorData.name}
                className="w-20 h-20 rounded-xl object-cover border border-foreground/10"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Shop
                  size={40}
                  color="currentColor"
                  variant="Bold"
                  className="text-secondary"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                  {vendorData?.name || "My Vendor Profile"}
                </h2>
                {vendorData?.isVerified && (
                  <TickCircle
                    size={24}
                    color="currentColor"
                    variant="Bold"
                    className="text-primary"
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/60 mb-3">
                <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-medium">
                  {vendorData?.category || "Vendor"}
                </span>
                {vendorData?.rating && (
                  <div className="flex items-center gap-1">
                    <Star1 size={16} color="currentColor" variant="Bold" className="text-primary" />
                    <span className="font-semibold text-foreground">
                      {vendorData.rating.toFixed(1)}
                    </span>
                    <span>({vendorData.reviews} reviews)</span>
                  </div>
                )}
                {vendorData?.location && (
                  <div className="flex items-center gap-1">
                    <Location size={16} color="currentColor" variant="Outline" />
                    <span>{vendorData.location}</span>
                  </div>
                )}
              </div>
              {vendorData?.availability && (
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      availabilityColors[vendorData.availability]
                    }`}
                  >
                    {availabilityLabels[vendorData.availability]}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 ml-4">
            <Button
              variant="outline"
              size="sm"
              leftIcon={Edit2}
              onClick={onEditVendor}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={ArrowRight2}
              onClick={onViewVendor}
            >
              View Public
            </Button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {vendorData?.coverImage && (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-foreground/10">
          <img
            src={vendorData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Description */}
      {vendorData?.description && (
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            About
          </h3>
          <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
            {vendorData.description}
          </p>
        </div>
      )}

      {/* Specialties */}
      {vendorData?.specialties && vendorData.specialties.length > 0 && (
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Specialties
          </h3>
          <div className="flex flex-wrap gap-2">
            {vendorData.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Contact Information
          </h3>
          <div className="space-y-3">
            {vendorData?.phone && (
              <div className="flex items-center gap-3 text-foreground/70">
                <Call size={20} color="currentColor" variant="Outline" />
                <span>{vendorData.phone}</span>
              </div>
            )}
            {vendorData?.email && (
              <div className="flex items-center gap-3 text-foreground/70">
                <Sms size={20} color="currentColor" variant="Outline" />
                <span>{vendorData.email}</span>
              </div>
            )}
            {vendorData?.website && (
              <div className="flex items-center gap-3">
                <Global size={20} color="currentColor" variant="Outline" className="text-foreground/70" />
                <a
                  href={vendorData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {vendorData.website}
                </a>
              </div>
            )}
            {vendorData?.address && (
              <div className="flex items-start gap-3 text-foreground/70">
                <Location size={20} color="currentColor" variant="Outline" className="mt-0.5" />
                <span>{vendorData.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Business Details
          </h3>
          <div className="space-y-3">
            {vendorData?.priceRange && (
              <div className="flex items-center gap-3">
                <MoneyRecive size={20} color="currentColor" variant="Outline" className="text-foreground/70" />
                <div>
                  <div className="text-sm text-foreground/60">Price Range</div>
                  <div className="font-semibold text-foreground">{vendorData.priceRange}</div>
                </div>
              </div>
            )}
            {vendorData?.yearsOfExperience && (
              <div className="flex items-center gap-3">
                <Briefcase size={20} color="currentColor" variant="Outline" className="text-foreground/70" />
                <div>
                  <div className="text-sm text-foreground/60">Experience</div>
                  <div className="font-semibold text-foreground">
                    {vendorData.yearsOfExperience} {vendorData.yearsOfExperience === "1" ? "year" : "years"}
                  </div>
                </div>
              </div>
            )}
            {vendorData?.category && (
              <div className="flex items-center gap-3">
                <Shop size={20} color="currentColor" variant="Outline" className="text-foreground/70" />
                <div>
                  <div className="text-sm text-foreground/60">Category</div>
                  <div className="font-semibold text-foreground">{vendorData.category}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio */}
      {vendorData?.portfolio && vendorData.portfolio.length > 0 && (
        <div className="bg-background border border-foreground/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Portfolio
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendorData.portfolio.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden border border-foreground/10 group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfileSection;

