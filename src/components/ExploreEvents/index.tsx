"use client";

import React, { useState, useEffect } from "react";
import { EventService } from "@/services/events";
import { EventCategory } from "@/types/event";
import { getApiCategory } from "@/utils/event-utils";
import ExploreHero from "@/components/ExploreEvents/ExploreHero";
import ExploreFilters from "@/components/ExploreEvents/ExploreFilters";
import EventsList from "@/components/ExploreEvents/EventsList";
import EmptyState from "@/components/ExploreEvents/EmptyState";
import { EventCardProps } from "@/components/Homepage/EventCard";
import EventRecommendations from "@/components/Events/EventRecommendations";

const ExploreEventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper to format price
  const formatPrice = (tickets: any[]) => {
    if (!tickets || tickets.length === 0) return "Free";
    const paidTickets = tickets.filter(t => t.type === 'PAID');
    if (paidTickets.length === 0) return "Free";
    const minPrice = Math.min(...paidTickets.map(t => t.price));
    return `₦${minPrice.toLocaleString()}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params: any = { limit: 20 };

        if (searchQuery) params.search = searchQuery;

        if (selectedCategory && selectedCategory !== 'all') {
          const apiCategory = getApiCategory(selectedCategory);
          if (apiCategory) {
            params.category = apiCategory;
          } else {
            // Fallback or ignore if no match, or try sending upper case
            params.category = selectedCategory.toUpperCase();
          }
        }

        if (selectedLocation && selectedLocation !== 'all' && selectedLocation !== 'nearby') {
          params.city = selectedLocation;
        }

        // Date filter mapping could be added here

        const response = await EventService.getEvents(params);

        const mappedEvents = response.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: formatDate(event.startDate),
          time: `${event.startTime} - ${event.endTime}`,
          location: event.venueName || event.city || "Online",
          price: formatPrice(event.tickets),
          category: event.category,
          image: event.coverImage,
          attendees: event.attendeesCount,
          locationType: event.locationType
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceId = setTimeout(() => {
      fetchEvents();
    }, 500);

    return () => clearTimeout(debounceId);
  }, [searchQuery, selectedCategory, selectedLocation, selectedDate]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDate("all");
    setSelectedLocation("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <ExploreHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <ExploreFilters
          selectedCategory={selectedCategory}
          selectedDate={selectedDate}
          selectedLocation={selectedLocation}
          onCategoryChange={setSelectedCategory}
          onDateChange={setSelectedDate}
          onLocationChange={setSelectedLocation}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : events.length > 0 ? (
        <>
          {/* Recommendations Section - Show at top if no filters applied */}
          {selectedCategory === "all" &&
            selectedDate === "all" &&
            selectedLocation === "all" &&
            searchQuery === "" && (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <EventRecommendations />
              </div>
            )}

          <EventsList
            events={events}
            viewMode={viewMode}
            searchQuery={searchQuery}
            onViewModeChange={setViewMode}
          />
        </>
      ) : (
        <EmptyState onClearFilters={handleClearFilters} />
      )}
    </div>
  );
};

export default ExploreEventsPage;
