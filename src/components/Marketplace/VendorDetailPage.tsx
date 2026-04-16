"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { MapPin, Star, CheckCircle, ShareNetwork, Heart, CaretLeft, ChatText, CalendarBlank, Phone, Envelope, Clock } from '@phosphor-icons/react';
import { useRouter } from "next/navigation";
import { VendorService, VendorProfile, VendorReview } from "@/services/vendor";

const categoryDisplayMap: Record<string, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  DJ_MUSIC: "DJ & MusicNote",
  CATERING: "Catering",
  VENUES: "Venues",
  DECORATIONS: "Decorations",
  SECURITY: "Security",
  LIGHTING: "Lighting",
  SOUND_SYSTEM: "Sound System",
  OTHER: "Other",
};

interface VendorDetailPageProps {
  vendorId: string;
}

const VendorDetailPage: React.FC<VendorDetailPageProps> = ({ vendorId }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [reviews, setReviews] = useState<VendorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await VendorService.getById(vendorId);
        setVendor(data);
        setReviews(data.reviews || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Vendor not found");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vendor?.name || "Vendor",
        text: `Check out ${vendor?.name} on EventFi Marketplace!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="h-6 w-40 bg-foreground/10 rounded animate-pulse mb-6" />
        </div>
        <div className="container mx-auto h-[300px] bg-foreground/5 animate-pulse" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 w-64 bg-foreground/10 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-48 bg-foreground/5 rounded animate-pulse mb-8" />
          <div className="h-32 bg-foreground/5 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60 mb-4">{error || "Vendor not found"}</p>
          <button onClick={() => router.push("/marketplace")} className="text-primary hover:underline">
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const priceRange =
    vendor.priceMin && vendor.priceMax
      ? `₦${vendor.priceMin.toLocaleString()} - ₦${vendor.priceMax.toLocaleString()}`
      : vendor.priceMin
        ? `From ₦${vendor.priceMin.toLocaleString()}`
        : "Contact for pricing";

  const categoryDisplay = categoryDisplayMap[vendor.category] || vendor.category;

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
        >
          <CaretLeft size={20} color="currentColor" weight="regular" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="relative container mx-auto h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        {vendor.coverImage ? (
          <Image src={vendor.coverImage} alt={vendor.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CheckCircle size={120} color="currentColor" weight="fill" className="text-primary/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Add to favorites"
          >
            <Heart
              size={20}
              color="currentColor"
              
              className={isFavorite ? "text-primary" : "text-foreground"}
            />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label="ShareNetwork vendor"
          >
            <ShareNetwork size={20} color="currentColor" weight="regular" />
          </button>
        </div>

        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full text-sm font-semibold text-primary">
            {categoryDisplay}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                  {vendor.name}
                </h1>
                {vendor.isVerified && (
                  <div className="mt-2">
                    <CheckCircle size={32} color="currentColor" weight="fill" className="text-primary" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star size={20} color="currentColor" weight="fill" className="text-primary" />
                  <span className="font-semibold text-foreground">{vendor.averageRating.toFixed(1)}</span>
                  <span className="text-foreground/60">({vendor.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <MapPin size={20} color="currentColor" weight="regular" />
                  <span>{vendor.location}</span>
                </div>
                {vendor.yearsOfExperience > 0 && (
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Clock size={20} color="currentColor" weight="regular" />
                    <span>{vendor.yearsOfExperience}+ years experience</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {vendor.specialties.map((specialty, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary font-medium">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">About</h2>
              <p className="text-foreground/70 leading-relaxed whitespace-pre-line">{vendor.description}</p>
            </div>

            {/* Portfolio */}
            {vendor.portfolio.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">Portfolio</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vendor.portfolio.map((url, index) => (
                    <div key={index} className="aspect-square rounded-xl border border-foreground/10 overflow-hidden">
                      <Image src={url} alt={`Portfolio ${index + 1}`} width={300} height={300} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                Reviews ({vendor.reviewCount})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-foreground/50 py-4">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-6 bg-foreground/5 rounded-xl border border-foreground/10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  color="currentColor"
                                  
                                  className={i < review.rating ? "text-primary" : "text-foreground/30"}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-foreground/60">{formatTimestamp(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-foreground/70">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-background border-2 border-foreground/10 rounded-2xl p-6 lg:p-8 shadow-lg">
                <div className="mb-6">
                  <div className="text-2xl font-bold text-foreground mb-2">{priceRange}</div>
                  <p className="text-sm text-foreground/60">Starting price</p>
                </div>

                <div className="mb-6 p-4 bg-primary/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={24} color="currentColor" weight="fill" className="text-primary" />
                    <span className="text-2xl font-bold text-foreground">{vendor.averageRating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-foreground/70">{vendor.reviewCount.toLocaleString()} reviews</p>
                </div>

                {(vendor.phone || vendor.email) && (
                  <div className="mb-6 space-y-3">
                    {vendor.phone && (
                      <a
                        href={`tel:${vendor.phone}`}
                        className="flex items-center gap-3 p-3 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors"
                      >
                        <Phone size={20} color="currentColor" weight="regular" />
                        <span className="text-foreground">{vendor.phone}</span>
                      </a>
                    )}
                    {vendor.email && (
                      <a
                        href={`mailto:${vendor.email}`}
                        className="flex items-center gap-3 p-3 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors"
                      >
                        <Envelope size={20} color="currentColor" weight="regular" />
                        <span className="text-foreground">{vendor.email}</span>
                      </a>
                    )}
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={CalendarBlank}
                  onClick={() => router.push(`/marketplace/${vendorId}/book`)}
                >
                  Book Vendor
                </Button>

                <div className="mt-6 pt-6 border-t border-foreground/10 space-y-3 text-sm text-foreground/60">
                  {vendor.isVerified && (
                    <div className="flex items-start gap-2">
                      <CheckCircle size={16} color="currentColor" weight="fill" />
                      <span>Verified vendor</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <ChatText size={16} color="currentColor" weight="regular" />
                    <span>Response within 24 hours</span>
                  </div>
                  {vendor.bookingCount > 0 && (
                    <div className="flex items-start gap-2">
                      <CalendarBlank size={16} color="currentColor" weight="regular" />
                      <span>{vendor.bookingCount} bookings completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
