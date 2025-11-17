"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
  Star1,
  ArrowLeft2,
  Calendar,
  Location,
  Clock,
  Image as ImageIcon,
  Trash,
} from "iconsax-react";

interface EventReviewFormProps {
  eventId: string;
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
}

const EventReviewForm: React.FC<EventReviewFormProps> = ({
  eventId,
  eventName = "Event",
  eventDate,
  eventLocation,
}) => {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPhotos((prev) => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (!review.trim()) {
      alert("Please write a review");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Review submitted successfully!");
      router.push(`/events/${eventId}`);
    }, 1500);
  };

  const isFormValid = rating > 0 && review.trim().length >= 10;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
            Write a Review
          </h1>
          <p className="text-foreground/60">
            Share your experience and help others discover great events
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Event Info Card */}
          <div className="bg-background border border-foreground/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">{eventName}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
              {eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} color="currentColor" variant="Outline" />
                  <span>{eventDate}</span>
                </div>
              )}
              {eventLocation && (
                <div className="flex items-center gap-2">
                  <Location size={16} color="currentColor" variant="Outline" />
                  <span>{eventLocation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-background border border-foreground/10 rounded-2xl p-6 lg:p-8 space-y-8">
            {/* Rating */}
            <div>
              <label className="block text-lg font-semibold text-foreground mb-4">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star1
                      size={40}
                      color="currentColor"
                      variant={
                        star <= (hoveredRating || rating) ? "Bold" : "Outline"
                      }
                      className={
                        star <= (hoveredRating || rating)
                          ? "text-primary"
                          : "text-foreground/30"
                      }
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-4 text-lg font-semibold text-foreground">
                    {rating} {rating === 1 ? "star" : "stars"}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/60 mt-2">
                Click on a star to rate your experience
              </p>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-lg font-semibold text-foreground mb-3">
                Review Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Amazing tech conference!"
                maxLength={100}
                className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-foreground/40"
              />
              <p className="text-sm text-foreground/60 mt-2">
                {title.length}/100 characters
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-lg font-semibold text-foreground mb-3">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience at this event. What did you like? What could be improved?"
                rows={8}
                maxLength={1000}
                className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-foreground/40 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-foreground/60">
                  Minimum 10 characters required
                </p>
                <p className="text-sm text-foreground/60">
                  {review.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-lg font-semibold text-foreground mb-3">
                Photos (Optional)
              </label>
              <div className="space-y-4">
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden border border-foreground/10 group"
                      >
                        <img
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash size={16} color="currentColor" variant="Bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {photos.length < 5 && (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-foreground/20 rounded-xl hover:border-primary transition-colors cursor-pointer">
                      <ImageIcon size={20} color="currentColor" variant="Outline" />
                      <span className="text-foreground/70 font-medium">
                        Add Photos ({photos.length}/5)
                      </span>
                    </div>
                  </label>
                )}
                <p className="text-sm text-foreground/60">
                  Upload up to 5 photos from the event
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-6 border-t border-foreground/10">
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                fullWidth
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventReviewForm;

