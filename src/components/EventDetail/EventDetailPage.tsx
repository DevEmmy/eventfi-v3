"use client";

import { useRouter } from "next/navigation";
import { EventService } from "@/services/events";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Heart, Share, ArrowLeft2, Chart, Clock, Location, Map, Star1, Ticket, Tag, MessageText1, TickCircle, User, People } from "iconsax-react";
import Button from "../Button";
import EventCard from "../Homepage/EventCard";
import { useUserStore } from "@/store/useUserStore";
import { useMessengerStore } from "@/store/useMessengerStore";

interface EventDetailPageProps {
  eventId: string;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ eventId }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const [event, setEvent] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [organizerId, setOrganizerId] = useState<string | null>(null);

  const { user } = useUserStore();
  const { openEventChat } = useMessengerStore();
  const isOrganizer = user?.id && organizerId ? user.id === organizerId : false;
  const hasAttended = true; // Replace with actual check - user must have attended to review
  const hasReviewed = false; // Replace with actual check

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data: any = await EventService.getEventById(eventId);

        // Map API data to component structure
        const mappedEvent = {
          id: data.id,
          title: data.title,
          date: new Date(data.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          time: `${data.startTime} - ${data.endTime}`,
          location: data.venueName || data.city || "Online",
          address: data.address || data.location?.address || "Online Event",
          price: data.tickets && data.tickets.length > 0
            ? (data.tickets[0].type === 'FREE' ? 'Free' : `₦${data.tickets[0].price.toLocaleString()}`)
            : "Free",
          category: data.category,
          attendees: data.attendeesCount || 0,
          image: data.coverImage,
          organizer: {
            name: data.organizer?.displayName || "Organizer",
            verified: data.organizer?.isVerified || false,
            avatar: data.organizer?.avatar || ""
          },
          description: data.description,
          schedule: data.scheduleItems && data.scheduleItems.length > 0
            ? data.scheduleItems
            : [
              { time: data.startTime, activity: "Event Starts" },
              { time: data.endTime, activity: "Event Ends" }
            ],
          tags: data.tags || []
        };

        setEvent(mappedEvent);
        setOrganizerId(data.organizerId || data.organizer?.id || null);

        // Fetch reviews, stats, and related events in parallel
        const [reviewsData, statsData, relatedData] = await Promise.all([
          EventService.getReviews(eventId, 1, 5).catch(() => ({ data: [], meta: {} })),
          EventService.getReviewStats(eventId).catch(() => ({ averageRating: 0, totalReviews: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } })),
          EventService.getRelatedEvents(eventId, 4).catch(() => [])
        ]);

        setReviews(reviewsData.data || []);
        setReviewStats(statsData);
        setRelatedEvents(relatedData.map((e: any) => ({
          id: e.id,
          title: e.title,
          date: new Date(e.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          time: `${e.startTime} - ${e.endTime}`,
          location: e.venueName || e.city || "Online",
          price: e.tickets && e.tickets.length > 0
            ? (e.tickets[0].type === 'FREE' ? 'Free' : `₦${e.tickets[0].price.toLocaleString()}`)
            : "Free",
          category: e.category,
          attendees: e.attendeesCount || 0,
        })));

      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-foreground/60 text-lg">{error || "Event not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} on EventFi!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
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
          <span>Back to Events</span>
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="relative container mx-auto h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar
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
          {isOrganizer && (
            <button
              onClick={() => router.push(`/events/${eventId}/manage`)}
              className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors backdrop-blur-sm flex items-center gap-2 cursor-pointer"
              aria-label="Manage event"
            >
              <Chart size={16} color="currentColor" variant="Bold" />
              Manage
            </button>
          )}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
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
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
            aria-label="Share event"
          >
            <Share size={20} color="currentColor" variant="Outline" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full text-sm font-semibold text-primary">
            {event.category}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                {event.title}
              </h1>

              {/* Event Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-foreground/70">
                  <Calendar size={20} color="currentColor" variant="Outline" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Clock size={20} color="currentColor" variant="Outline" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Location size={20} color="currentColor" variant="Outline" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <People size={20} color="currentColor" variant="Outline" />
                  <span>{event.attendees.toLocaleString()} going</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag: any, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-foreground/5 rounded-full text-sm text-foreground/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Organizer Info */}
            <div className="p-6 bg-foreground/5 rounded-2xl border border-foreground/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  {/* <User size={32} color="currentColor" variant="Bold" className="text-primary" /> */}
                  <Image
                    src={event.organizer.avatar || "/placeholder.jpg"}
                    alt={event.organizer.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {event.organizer.name}
                    </h3>
                    {event.organizer.verified && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60">Event Organizer</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                About This Event
              </h2>
              <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Schedule */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                Schedule
              </h2>
              <div className="space-y-3">
                {event.schedule.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-foreground/5 rounded-xl border border-foreground/10"
                  >
                    <div className="font-semibold text-primary min-w-[100px]">
                      {item.time}
                    </div>
                    <div className="text-foreground/70">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                Location
              </h2>
              <div className="bg-foreground/5 rounded-2xl border border-foreground/10 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Map size={24} color="currentColor" variant="Bold" className="text-primary" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      {event.location}
                    </p>
                    <p className="text-foreground/70 text-sm">{event.address}</p>
                  </div>
                </div>
                {/* Map placeholder - Replace with actual map component */}
                <div className="w-full h-64 bg-foreground/10 rounded-xl flex items-center justify-center">
                  <Map size={48} color="currentColor" variant="Outline" className="text-foreground/30" />
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                  Reviews ({reviewStats?.totalReviews || 0})
                </h2>
                {(
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/events/${eventId}/review`)}
                  >
                    Write a Review
                  </Button>
                )}
              </div>

              {/* Rating Summary */}
              {reviewStats && (
                <div className="bg-foreground/5 rounded-2xl border border-foreground/10 p-6 mb-6">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-foreground mb-1">
                        {reviewStats.averageRating?.toFixed(1) || "0.0"}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star1
                            key={star}
                            size={20}
                            color="currentColor"
                            variant={star <= Math.round(reviewStats.averageRating || 0) ? "Bold" : "Outline"}
                            className={
                              star <= Math.round(reviewStats.averageRating || 0)
                                ? "text-primary"
                                : "text-foreground/30"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm text-foreground/60 mt-2">
                        Based on {reviewStats.totalReviews || 0} reviews
                      </p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviewStats.ratingDistribution?.[star as keyof typeof reviewStats.ratingDistribution] || 0;
                        const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-16">
                              <span className="text-sm font-semibold text-foreground">
                                {star}
                              </span>
                              <Star1
                                size={14}
                                color="currentColor"
                                variant="Bold"
                                className="text-primary"
                              />
                            </div>
                            <div className="flex-1 h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-foreground/60 w-12 text-right">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="bg-foreground/5 rounded-2xl border border-foreground/10 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {review.userAvatar ? (
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User size={24} color="currentColor" variant="Bold" className="text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">
                              {review.userName}
                            </h4>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star1
                                  key={star}
                                  size={16}
                                  color="currentColor"
                                  variant={star <= review.rating ? "Bold" : "Outline"}
                                  className={
                                    star <= review.rating
                                      ? "text-primary"
                                      : "text-foreground/30"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          {review.title && (
                            <h5 className="font-medium text-foreground mb-1">
                              {review.title}
                            </h5>
                          )}
                          <p className="text-sm text-foreground/60">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground/70 mb-4 leading-relaxed">
                      {review.comment}
                    </p>
                    {review.photos && review.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {review.photos.map((photo: string, index: number) => (
                          <div
                            key={index}
                            className="aspect-square rounded-xl overflow-hidden border border-foreground/10"
                          >
                            <img
                              src={photo}
                              alt={`Review photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 pt-4 border-t border-foreground/10">
                      <button className="flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors">
                        <TickCircle size={16} color="currentColor" variant="Outline" />
                        <span>Helpful ({review.helpfulCount || 0})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {reviewStats?.totalReviews > 5 && (
                <div className="text-center mt-6">
                  <Button variant="outline" size="md">
                    Load More Reviews
                  </Button>
                </div>
              )}
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-6 text-foreground">
                  You Might Also Like
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {relatedEvents.map((relatedEvent) => (
                    <div
                      key={relatedEvent.id}
                      onClick={() => {
                        router.push(`/events/${relatedEvent.id}`);
                      }}
                    >
                      <EventCard {...relatedEvent} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Ticket Purchase */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-background border-2 border-foreground/10 rounded-2xl p-6 lg:p-8 shadow-lg">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-foreground">
                      {event.price}
                    </span>
                    {event.price !== "Free" && (
                      <span className="text-sm text-foreground/60">per ticket</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60">
                    {event.attendees.toLocaleString()} people going
                  </p>
                </div>

                {/* Ticket Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Number of Tickets
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        setTicketQuantity(Math.max(1, ticketQuantity - 1))
                      }
                      className="w-10 h-10 rounded-full border-2 border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-foreground min-w-[3rem] text-center">
                      {ticketQuantity}
                    </span>
                    <button
                      onClick={() => setTicketQuantity(ticketQuantity + 1)}
                      className="w-10 h-10 rounded-full border-2 border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                {event.price !== "Free" && (
                  <div className="mb-6 p-4 bg-primary/10 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Total</span>
                      <span className="text-xl font-bold text-primary">
                        ₦{parseInt(event.price.replace(/[₦,]/g, "")) * ticketQuantity}
                      </span>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    // Handle ticket purchase
                    window.location.href = `/events/${eventId}/checkout?qty=${ticketQuantity}`;
                  }}
                >
                  <Ticket size={20} color="currentColor" variant="Bold" />
                  Get Tickets
                </Button>

                {/* Join Event Chat Button */}
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => openEventChat(eventId)}
                  className="mt-3"
                >
                  <MessageText1 size={18} color="currentColor" variant="Outline" />
                  Join Event Chat
                </Button>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-foreground/10 space-y-3 text-sm text-foreground/60">
                  <div className="flex items-start gap-2">
                    <Tag size={16} color="currentColor" variant="Outline" />
                    <span>Free cancellation up to 24 hours before event</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Ticket size={16} color="currentColor" variant="Outline" />
                    <span>Mobile tickets accepted</span>
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

export default EventDetailPage;

