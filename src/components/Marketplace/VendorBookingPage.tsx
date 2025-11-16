"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Button";
import {
  ArrowLeft2,
  Calendar,
  Clock,
  Location,
  Shop,
  User,
  Sms,
  Call,
  DocumentText,
  TickCircle,
  Lock,
} from "iconsax-react";
import Image from "next/image";

interface VendorBookingPageProps {
  vendorId: string;
}

const VendorBookingPage: React.FC<VendorBookingPageProps> = ({ vendorId }) => {
  const router = useRouter();

  // Mock vendor data - Replace with API call
  const vendor = {
    id: vendorId,
    name: "Elite Photography Studio",
    category: "Photography",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 245,
    priceRange: "₦50,000 - ₦200,000",
    verified: true,
    image: undefined,
    specialties: ["Wedding Photography", "Corporate Events", "Portrait Sessions"],
  };

  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventType: "",
    guestCount: "",
    duration: "",
    specialRequests: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventTypes = [
    "Wedding",
    "Corporate Event",
    "Birthday Party",
    "Conference",
    "Concert",
    "Festival",
    "Portrait Session",
    "Other",
  ];

  const durationOptions = [
    "2 hours",
    "4 hours",
    "6 hours",
    "8 hours",
    "Full Day (10+ hours)",
    "Multi-day",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = "Event name is required";
    }
    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    } else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.eventDate = "Event date cannot be in the past";
      }
    }
    if (!formData.eventTime) {
      newErrors.eventTime = "Event time is required";
    }
    if (!formData.eventLocation.trim()) {
      newErrors.eventLocation = "Event location is required";
    }
    if (!formData.eventType) {
      newErrors.eventType = "Event type is required";
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Booking request submitted:", formData);
      alert("Booking request sent successfully! The vendor will contact you within 24 hours.");
      router.push(`/marketplace/${vendorId}`);
    }, 2000);
  };

  // Calculate estimated price (mock calculation)
  const calculateEstimatedPrice = () => {
    const basePrice = 100000; // Base price in Naira
    const durationMultiplier = formData.duration ? parseFloat(formData.duration.split(" ")[0]) / 2 : 1;
    const guestMultiplier = formData.guestCount ? Math.ceil(parseInt(formData.guestCount) / 50) : 1;
    return Math.round(basePrice * durationMultiplier * guestMultiplier);
  };

  const estimatedPrice = formData.eventDate && formData.duration ? calculateEstimatedPrice() : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
            <span>Back to Vendor</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
              Book {vendor.name}
            </h1>
            <p className="text-foreground/60">
              Fill out the form below to request a booking. The vendor will respond within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6 lg:p-8 space-y-8">
                  {/* Vendor Summary */}
                  <div className="pb-6 border-b border-foreground/10">
                    <div className="flex items-center gap-4">
                      {vendor.image ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={vendor.image}
                            alt={vendor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          <Shop size={32} color="currentColor" variant="Bold" className="text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-foreground mb-1 truncate">
                          {vendor.name}
                        </h3>
                        <p className="text-sm text-foreground/60">{vendor.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-foreground">
                            ⭐ {vendor.rating}
                          </span>
                          <span className="text-xs text-foreground/60">
                            ({vendor.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div>
                    <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                      Event Details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Event Name <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          name="eventName"
                          value={formData.eventName}
                          onChange={handleInputChange}
                          placeholder="e.g., Tech Conference 2024"
                          className={`w-full px-4 py-3 bg-background border ${
                            errors.eventName ? "border-red-500" : "border-foreground/20"
                          } rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                          required
                        />
                        {errors.eventName && (
                          <p className="text-sm text-red-500 mt-1">{errors.eventName}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Event Date <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <Calendar
                              size={20}
                              color="currentColor"
                              variant="Outline"
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                            />
                            <input
                              type="date"
                              name="eventDate"
                              value={formData.eventDate}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split("T")[0]}
                              className={`w-full pl-12 pr-4 py-3 bg-background border ${
                                errors.eventDate ? "border-red-500" : "border-foreground/20"
                              } rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                              required
                            />
                          </div>
                          {errors.eventDate && (
                            <p className="text-sm text-red-500 mt-1">{errors.eventDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Event Time <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <Clock
                              size={20}
                              color="currentColor"
                              variant="Outline"
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                            />
                            <input
                              type="time"
                              name="eventTime"
                              value={formData.eventTime}
                              onChange={handleInputChange}
                              className={`w-full pl-12 pr-4 py-3 bg-background border ${
                                errors.eventTime ? "border-red-500" : "border-foreground/20"
                              } rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                              required
                            />
                          </div>
                          {errors.eventTime && (
                            <p className="text-sm text-red-500 mt-1">{errors.eventTime}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Event Location <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <Location
                            size={20}
                            color="currentColor"
                            variant="Outline"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                          />
                          <input
                            type="text"
                            name="eventLocation"
                            value={formData.eventLocation}
                            onChange={handleInputChange}
                            placeholder="e.g., Eko Hotel & Suites, Victoria Island"
                            className={`w-full pl-12 pr-4 py-3 bg-background border ${
                              errors.eventLocation ? "border-red-500" : "border-foreground/20"
                            } rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                            required
                          />
                        </div>
                        {errors.eventLocation && (
                          <p className="text-sm text-red-500 mt-1">{errors.eventLocation}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Event Type <span className="text-primary">*</span>
                          </label>
                          <select
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-background border ${
                              errors.eventType ? "border-red-500" : "border-foreground/20"
                            } rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                            required
                          >
                            <option value="">Select event type</option>
                            {eventTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          {errors.eventType && (
                            <p className="text-sm text-red-500 mt-1">{errors.eventType}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Expected Guest Count
                          </label>
                          <input
                            type="number"
                            name="guestCount"
                            value={formData.guestCount}
                            onChange={handleInputChange}
                            placeholder="e.g., 100"
                            min="1"
                            className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Service Duration
                        </label>
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        >
                          <option value="">Select duration</option>
                          {durationOptions.map((duration) => (
                            <option key={duration} value={duration}>
                              {duration}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Special Requests or Notes
                        </label>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          placeholder="Any specific requirements, themes, or special requests..."
                          rows={4}
                          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                      Contact Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Full Name <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <User
                            size={20}
                            color="currentColor"
                            variant="Outline"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                          />
                          <input
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className={`w-full pl-12 pr-4 py-3 bg-background border ${
                              errors.contactName ? "border-red-500" : "border-foreground/20"
                            } rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                            required
                          />
                        </div>
                        {errors.contactName && (
                          <p className="text-sm text-red-500 mt-1">{errors.contactName}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Email Address <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <Sms
                              size={20}
                              color="currentColor"
                              variant="Outline"
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                            />
                            <input
                              type="email"
                              name="contactEmail"
                              value={formData.contactEmail}
                              onChange={handleInputChange}
                              placeholder="your@email.com"
                              className={`w-full pl-12 pr-4 py-3 bg-background border ${
                                errors.contactEmail ? "border-red-500" : "border-foreground/20"
                              } rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                              required
                            />
                          </div>
                          {errors.contactEmail && (
                            <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Phone Number <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <Call
                              size={20}
                              color="currentColor"
                              variant="Outline"
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                            />
                            <input
                              type="tel"
                              name="contactPhone"
                              value={formData.contactPhone}
                              onChange={handleInputChange}
                              placeholder="+234 800 000 0000"
                              className={`w-full pl-12 pr-4 py-3 bg-background border ${
                                errors.contactPhone ? "border-red-500" : "border-foreground/20"
                              } rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                              required
                            />
                          </div>
                          {errors.contactPhone && (
                            <p className="text-sm text-red-500 mt-1">{errors.contactPhone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-foreground/10">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      leftIcon={TickCircle}
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Send Booking Request
                    </Button>
                    <p className="text-xs text-center text-foreground/60 mt-3">
                      By submitting, you agree to our Terms of Service. The vendor will contact you within 24 hours.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-background border-2 border-foreground/10 rounded-2xl p-6 lg:p-8 shadow-lg">
                  <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-6 text-foreground">
                    Booking Summary
                  </h2>

                  {/* Estimated Price */}
                  {estimatedPrice && (
                    <div className="mb-6 p-4 bg-primary/10 rounded-xl">
                      <div className="text-sm text-foreground/60 mb-1">Estimated Price</div>
                      <div className="text-2xl font-bold text-primary">
                        ₦{estimatedPrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-foreground/60 mt-1">
                        Final price will be confirmed by vendor
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="mb-6">
                    <div className="text-sm text-foreground/60 mb-2">Price Range</div>
                    <div className="font-semibold text-foreground">{vendor.priceRange}</div>
                  </div>

                  {/* Vendor Info */}
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <TickCircle size={16} color="currentColor" variant="Bold" className="text-primary" />
                      <span>Verified vendor</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <DocumentText size={16} color="currentColor" variant="Outline" />
                      <span>Response within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Lock size={16} color="currentColor" variant="Outline" />
                      <span>Secure booking process</span>
                    </div>
                  </div>

                  {/* What Happens Next */}
                  <div className="pt-6 border-t border-foreground/10">
                    <h3 className="font-semibold text-foreground mb-3">What Happens Next?</h3>
                    <ol className="space-y-2 text-sm text-foreground/70">
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">1.</span>
                        <span>Submit your booking request</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">2.</span>
                        <span>Vendor reviews your request</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">3.</span>
                        <span>Receive confirmation within 24 hours</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">4.</span>
                        <span>Finalize details and payment</span>
                      </li>
                    </ol>
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

export default VendorBookingPage;

