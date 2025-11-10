"use client";

import React, { useState } from "react";
import ExploreHero from "@/components/ExploreEvents/ExploreHero";
import ExploreFilters from "@/components/ExploreEvents/ExploreFilters";
import EventsList from "@/components/ExploreEvents/EventsList";
import EmptyState from "@/components/ExploreEvents/EmptyState";
import { EventCardProps } from "@/components/Homepage/EventCard";

const ExploreEventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Sample event data - Replace with actual API data
  const events: EventCardProps[] = [
    {
      id: "1",
      title: "Tech Fest Lagos 2024",
      date: "March 15, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Lagos Convention Centre",
      price: "₦5,000",
      category: "Technology",
      attendees: 1250,
    },
    {
      id: "2",
      title: "Afro Nation Music Festival",
      date: "March 22, 2024",
      time: "2:00 PM - 11:00 PM",
      location: "Tafawa Balewa Square",
      price: "₦15,000",
      category: "Music",
      attendees: 3500,
    },
    {
      id: "3",
      title: "DevFest Lagos",
      date: "March 30, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Google Developer Space",
      price: "Free",
      category: "Tech Meetup",
      attendees: 800,
    },
    {
      id: "4",
      title: "Startup Summit 2024",
      date: "April 5, 2024",
      time: "8:00 AM - 7:00 PM",
      location: "Eko Hotel & Suites",
      price: "₦10,000",
      category: "Business",
      attendees: 2100,
    },
    {
      id: "5",
      title: "Gaming Night Championship",
      date: "April 12, 2024",
      time: "6:00 PM - 12:00 AM",
      location: "Gaming Arena Lagos",
      price: "₦3,000",
      category: "Gaming",
      attendees: 450,
    },
    {
      id: "6",
      title: "Art Exhibition Opening",
      date: "April 18, 2024",
      time: "5:00 PM - 9:00 PM",
      location: "National Gallery",
      price: "₦2,500",
      category: "Arts",
      attendees: 320,
    },
  ];

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

      {filteredEvents.length > 0 ? (
        <EventsList
          events={filteredEvents}
          viewMode={viewMode}
          searchQuery={searchQuery}
          onViewModeChange={setViewMode}
        />
      ) : (
        <EmptyState onClearFilters={handleClearFilters} />
      )}
    </div>
  );
};

export default ExploreEventsPage;
