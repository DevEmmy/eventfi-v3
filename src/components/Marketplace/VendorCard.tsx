"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Star, CheckCircle, Briefcase } from '@phosphor-icons/react';

export interface VendorCardProps {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  verified: boolean;
  image?: string;
  specialties?: string[];
  onClick?: () => void;
}

const VendorCard: React.FC<VendorCardProps> = ({
  name,
  category,
  location,
  rating,
  reviewCount,
  priceRange,
  verified,
  image,
  specialties,
  onClick,
}) => {
  return (
    <div
      className="group relative bg-background rounded-2xl overflow-hidden border border-foreground/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Briefcase
              size={64}
              color="currentColor"
              weight="fill"
              className="text-primary/30"
            />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary">
            {category}
          </span>
        </div>

        {/* Verified Badge */}
        {verified && (
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle
                size={18}
                color="white"
                weight="fill"
              />
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Name & Rating */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1 flex-1">
              {name}
            </h3>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={16} color="currentColor" weight="fill" className="text-primary" />
              <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-foreground/60">
              ({reviewCount.toLocaleString()} reviews)
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-foreground/70 mb-4">
          <MapPin size={16} color="currentColor" weight="regular" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Specialties */}
        {specialties && specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-foreground/5 rounded-full text-xs text-foreground/70"
              >
                {specialty}
              </span>
            ))}
            {specialties.length > 3 && (
              <span className="px-2 py-1 bg-foreground/5 rounded-full text-xs text-foreground/70">
                +{specialties.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-foreground/10 mt-auto">
          {/* Price Range */}
          <div className="font-bold text-foreground">{priceRange}</div>

          {/* Verified Label */}
          {verified && (
            <span className="text-xs text-primary font-medium flex items-center gap-1">
              <CheckCircle size={14} color="currentColor" weight="fill" />
              Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorCard;

