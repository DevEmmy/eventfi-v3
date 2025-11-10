"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import {
  Location,
  Star1,
  TickCircle,
  Share,
  Heart,
  ArrowLeft2,
  MessageText1,
  Calendar,
  Call,
  Sms,
} from "iconsax-react";
import { useRouter } from "next/navigation";

interface VendorDetailPageProps {
  vendorId: string;
}

const VendorDetailPage: React.FC<VendorDetailPageProps> = ({ vendorId }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample vendor data - Replace with API call
  const vendor = {
    id: vendorId,
    name: "Elite Photography Studio",
    category: "Photography",
    location: "Lagos, Nigeria",
    address: "123 Victoria Island, Lagos",
    rating: 4.8,
    reviewCount: 245,
    priceRange: "₦50,000 - ₦200,000",
    verified: true,
    image: undefined,
    specialties: ["Wedding Photography", "Corporate Events", "Portrait Sessions"],
    description: `Elite Photography Studio is a premier photography service provider with over 10 years of experience capturing life's most precious moments. We specialize in wedding photography, corporate events, and professional portrait sessions.

Our team of skilled photographers uses state-of-the-art equipment to deliver stunning, high-quality images that tell your story beautifully. We pride ourselves on our attention to detail, creative vision, and commitment to exceeding client expectations.

Whether you're planning an intimate wedding, a corporate conference, or need professional headshots, Elite Photography Studio is your trusted partner for all your photography needs.`,
    portfolio: [
      { id: 1, type: "image", url: "" },
      { id: 2, type: "image", url: "" },
      { id: 3, type: "image", url: "" },
      { id: 4, type: "image", url: "" },
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolutely amazing work! They captured every moment perfectly at our wedding.",
      },
      {
        id: 2,
        name: "Michael Chen",
        rating: 5,
        date: "1 month ago",
        comment: "Professional, punctual, and the photos were stunning. Highly recommend!",
      },
    ],
    contact: {
      phone: "+234 800 123 4567",
      email: "contact@elitephoto.com",
    },
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vendor.name,
        text: `Check out ${vendor.name} on EventFi Marketplace!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
        >
          <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="relative container mx-auto h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        {vendor.image ? (
          <Image
            src={vendor.image}
            alt={vendor.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TickCircle
              size={120}
              color="currentColor"
              variant="Bold"
              className="text-primary/30"
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Add to favorites"
          >
            <Heart
              size={20}
              color="currentColor"
              variant={isFavorite ? "Bold" : "Outline"}
              className={isFavorite ? "text-primary" : "text-foreground"}
            />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Share vendor"
          >
            <Share size={20} color="currentColor" variant="Outline" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full text-sm font-semibold text-primary">
            {vendor.category}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vendor Header */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                  {vendor.name}
                </h1>
                {vendor.verified && (
                  <div className="mt-2">
                    <TickCircle
                      size={32}
                      color="currentColor"
                      variant="Bold"
                      className="text-primary"
                    />
                  </div>
                )}
              </div>

              {/* Rating & Location */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star1 size={20} color="currentColor" variant="Bold" className="text-primary" />
                  <span className="font-semibold text-foreground">
                    {vendor.rating.toFixed(1)}
                  </span>
                  <span className="text-foreground/60">
                    ({vendor.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Location size={20} color="currentColor" variant="Outline" />
                  <span>{vendor.location}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {vendor.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                About
              </h2>
              <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
                {vendor.description}
              </p>
            </div>

            {/* Portfolio */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                Portfolio
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vendor.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square bg-foreground/5 rounded-xl border border-foreground/10 flex items-center justify-center"
                  >
                    <TickCircle
                      size={32}
                      color="currentColor"
                      variant="Outline"
                      className="text-foreground/30"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                Reviews ({vendor.reviewCount})
              </h2>
              <div className="space-y-4">
                {vendor.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 bg-foreground/5 rounded-xl border border-foreground/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {review.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star1
                                key={i}
                                size={16}
                                color="currentColor"
                                variant={i < review.rating ? "Bold" : "Outline"}
                                className={
                                  i < review.rating ? "text-primary" : "text-foreground/30"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-foreground/60">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground/70">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-background border-2 border-foreground/10 rounded-2xl p-6 lg:p-8 shadow-lg">
                {/* Price Range */}
                <div className="mb-6">
                  <div className="text-2xl font-bold text-foreground mb-2">
                    {vendor.priceRange}
                  </div>
                  <p className="text-sm text-foreground/60">Starting price</p>
                </div>

                {/* Rating Summary */}
                <div className="mb-6 p-4 bg-primary/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Star1 size={24} color="currentColor" variant="Bold" className="text-primary" />
                    <span className="text-2xl font-bold text-foreground">
                      {vendor.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70">
                    {vendor.reviewCount.toLocaleString()} reviews
                  </p>
                </div>

                {/* Contact Info */}
                <div className="mb-6 space-y-3">
                  <a
                    href={`tel:${vendor.contact.phone}`}
                    className="flex items-center gap-3 p-3 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors"
                  >
                    <Call size={20} color="currentColor" variant="Outline" />
                    <span className="text-foreground">{vendor.contact.phone}</span>
                  </a>
                  <a
                    href={`mailto:${vendor.contact.email}`}
                    className="flex items-center gap-3 p-3 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors"
                  >
                    <Sms size={20} color="currentColor" variant="Outline" />
                    <span className="text-foreground">{vendor.contact.email}</span>
                  </a>
                </div>

                {/* CTA Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={Calendar}
                  onClick={() => {
                    window.location.href = `/marketplace/${vendorId}/book`;
                  }}
                >
                  Book Vendor
                </Button>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-foreground/10 space-y-3 text-sm text-foreground/60">
                  <div className="flex items-start gap-2">
                    <TickCircle size={16} color="currentColor" variant="Bold" />
                    <span>Verified vendor</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageText1 size={16} color="currentColor" variant="Outline" />
                    <span>Response within 24 hours</span>
                  </div>
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

