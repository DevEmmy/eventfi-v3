"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, Location, Clock, Ticket, Heart, Link1, Share } from "iconsax-react";
import { UserService } from "@/services/user";
import customToast from "@/lib/toast";

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  category: string;
  image?: string;
  attendees?: number;
  isSaved?: boolean;
  onClick?: () => void;
  locationType?: "ONLINE" | "PHYSICAL";
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  time,
  location,
  price,
  category,
  image,
  attendees,
  locationType,
  isSaved = false,
  onClick,
}) => {
  const [isFavorite, setIsFavorite] = useState(isSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        await UserService.removeFavorite(id);
        setIsFavorite(false);
        customToast.success("Event removed from saved");
      } else {
        await UserService.addFavorite(id);
        setIsFavorite(true);
        customToast.success("Event saved!");
      }
    } catch (error: any) {
      console.error("Failed to update favorite:", error);
      // If unauthorized, show login message
      if (error.response?.status === 401) {
        customToast.error("Please login to save events");
      } else {
        customToast.error("Failed to save event. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const shareUrl = `${window.location.origin}/events/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out ${title} on EventFi!`,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        customToast.success("Link copied to clipboard!");
      } catch (error) {
        customToast.error("Failed to copy link");
      }
    }
  };

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
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar
              size={64}
              color="currentColor"
              variant="Bold"
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

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={handleShare}
            className="p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            aria-label="Share event"
          >
            <Share
              size={20}
              color="currentColor"
              variant="Outline"
              className="text-foreground"
            />
          </button>
          <button
            onClick={handleFavoriteClick}
            className="p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={20}
              color="currentColor"
              variant={isFavorite ? "Bold" : "Outline"}
              className={isFavorite ? "text-primary" : "text-foreground"}
            />
          </button>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-3 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Event Details */}
        <div className="space-y-2 mb-4 flex-1">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Calendar size={16} color="currentColor" variant="Outline" />
            <span>{date}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Clock size={16} color="currentColor" variant="Outline" />
            <span>{time}</span>
          </div>

          {/* Location */}
          {
            locationType === "PHYSICAL" ? (
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Location size={16} color="currentColor" variant="Outline" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )
              :

              (
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Link1 size={16} color="currentColor" variant="Outline" />
                  <span className="line-clamp-1">Virtual (Online)</span>
                </div>
              )
          }
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
          {/* Price */}
          <div className="flex items-center gap-2">
            <Ticket size={18} color="currentColor" variant="Bold" className="text-primary" />
            <span className="font-bold text-foreground">{price}</span>
          </div>

          {/* Attendees Count (if available) */}
          {attendees !== undefined && (
            <span className="text-xs text-foreground/60">
              {attendees.toLocaleString()} going
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;

