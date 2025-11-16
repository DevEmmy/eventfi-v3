"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import EventCard, { EventCardProps } from "@/components/Homepage/EventCard";
import VendorCard, { VendorCardProps } from "@/components/Marketplace/VendorCard";
import {
  Calendar,
  Shop,
  User,
  Grid3,
  RowVertical,
  SearchNormal1,
} from "iconsax-react";

type TabType = "all" | "events" | "vendors" | "users";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Update search query when URL param changes
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  // Mock data - Replace with actual API calls
  const allEvents: EventCardProps[] = [
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
  ];

  const allVendors: VendorCardProps[] = [
    {
      id: "1",
      name: "Elite Photography Studio",
      category: "Photography",
      location: "Lagos, Nigeria",
      rating: 4.8,
      reviewCount: 245,
      priceRange: "₦50,000 - ₦200,000",
      verified: true,
      specialties: ["Wedding", "Corporate", "Events"],
    },
    {
      id: "2",
      name: "SoundWave DJ Services",
      category: "DJ & Music",
      location: "Lagos, Nigeria",
      rating: 4.9,
      reviewCount: 189,
      priceRange: "₦30,000 - ₦150,000",
      verified: true,
      specialties: ["Parties", "Corporate", "Weddings"],
    },
  ];

  const allUsers = [
    {
      id: "1",
      username: "alex-johnson",
      displayName: "Alex Johnson",
      bio: "Event organizer passionate about bringing communities together.",
      location: "Lagos, Nigeria",
      isVerified: true,
      stats: {
        eventsHosted: 24,
        eventsAttended: 156,
        followers: 1240,
      },
    },
    {
      id: "2",
      username: "sarah-events",
      displayName: "Sarah Events",
      bio: "Professional event planner with 10+ years of experience.",
      location: "Abuja, Nigeria",
      isVerified: false,
      stats: {
        eventsHosted: 18,
        eventsAttended: 89,
        followers: 567,
      },
    },
  ];

  // Filter results based on search query
  const filterResults = <T extends { title?: string; name?: string; displayName?: string; location?: string; category?: string; bio?: string }>(
    items: T[]
  ): T[] => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const title = item.title || item.name || item.displayName || "";
      const location = item.location || "";
      const category = item.category || "";
      const bio = item.bio || "";

      return (
        title.toLowerCase().includes(query) ||
        location.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        bio.toLowerCase().includes(query)
      );
    });
  };

  const filteredEvents = filterResults(allEvents);
  const filteredVendors = filterResults(allVendors);
  const filteredUsers = filterResults(allUsers);

  const totalResults = filteredEvents.length + filteredVendors.length + filteredUsers.length;

  const tabs = [
    { id: "all" as TabType, label: "All", count: totalResults, icon: SearchNormal1 },
    { id: "events" as TabType, label: "Events", count: filteredEvents.length, icon: Calendar },
    { id: "vendors" as TabType, label: "Vendors", count: filteredVendors.length, icon: Shop },
    { id: "users" as TabType, label: "Users", count: filteredUsers.length, icon: User },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (query.trim()) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }
    window.history.pushState({}, "", url);
  };

  const renderResults = () => {
    if (activeTab === "all") {
      return (
        <div className="space-y-12">
          {/* Events Section */}
          {filteredEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Calendar size={24} color="currentColor" variant="Bold" className="text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  Events ({filteredEvents.length})
                </h3>
              </div>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      window.location.href = `/events/${event.id}`;
                    }}
                    className="cursor-pointer"
                  >
                    <EventCard {...event} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vendors Section */}
          {filteredVendors.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shop size={24} color="currentColor" variant="Bold" className="text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  Vendors ({filteredVendors.length})
                </h3>
              </div>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    onClick={() => {
                      window.location.href = `/marketplace/${vendor.id}`;
                    }}
                    className="cursor-pointer"
                  >
                    <VendorCard {...vendor} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Section */}
          {filteredUsers.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <User size={24} color="currentColor" variant="Bold" className="text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  Users ({filteredUsers.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      window.location.href = `/profile/${user.username}`;
                    }}
                    className="p-6 bg-background border border-foreground/10 rounded-2xl hover:border-primary transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <User size={32} color="currentColor" variant="Bold" className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-foreground truncate">
                            {user.displayName}
                          </h4>
                          {user.isVerified && (
                            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground/60 mb-2">@{user.username}</p>
                        {user.bio && (
                          <p className="text-sm text-foreground/70 line-clamp-2 mb-3">
                            {user.bio}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-foreground/60">
                          <span>{user.stats.eventsHosted} Events</span>
                          <span>{user.stats.followers} Followers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "events") {
      return (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => {
                window.location.href = `/events/${event.id}`;
              }}
              className="cursor-pointer"
            >
              <EventCard {...event} />
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "vendors") {
      return (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              onClick={() => {
                window.location.href = `/marketplace/${vendor.id}`;
              }}
              className="cursor-pointer"
            >
              <VendorCard {...vendor} />
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "users") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                window.location.href = `/profile/${user.username}`;
              }}
              className="p-6 bg-background border border-foreground/10 rounded-2xl hover:border-primary transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <User size={32} color="currentColor" variant="Bold" className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground truncate">{user.displayName}</h4>
                    {user.isVerified && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60 mb-2">@{user.username}</p>
                  {user.bio && (
                    <p className="text-sm text-foreground/70 line-clamp-2 mb-3">{user.bio}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-foreground/60">
                    <span>{user.stats.eventsHosted} Events</span>
                    <span>{user.stats.followers} Followers</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const hasResults =
    (activeTab === "all" && totalResults > 0) ||
    (activeTab === "events" && filteredEvents.length > 0) ||
    (activeTab === "vendors" && filteredVendors.length > 0) ||
    (activeTab === "users" && filteredUsers.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-background border-b border-foreground/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <SearchBar
              placeholder="Search events, vendors, users..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Search Results"}
              </h1>
              <p className="text-foreground/60">
                {totalResults > 0
                  ? `Found ${totalResults} result${totalResults !== 1 ? "s" : ""}`
                  : "No results found"}
              </p>
            </div>

            {hasResults && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "bg-foreground/5 text-foreground/70 hover:bg-primary/10"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3 size={20} color="currentColor" variant="Outline" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-foreground/5 text-foreground/70 hover:bg-primary/10"
                  }`}
                  aria-label="List view"
                >
                  <RowVertical size={20} color="currentColor" variant="Outline" />
                </button>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-foreground/10">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <TabIcon size={18} color="currentColor" variant="Outline" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-foreground/10 text-foreground/60"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {hasResults ? (
          <div>{renderResults()}</div>
        ) : (
          <div className="text-center py-16">
            <SearchNormal1
              size={64}
              color="currentColor"
              variant="Outline"
              className="mx-auto text-foreground/20 mb-4"
            />
            <h3 className="text-xl font-bold text-foreground mb-2">No Results Found</h3>
            <p className="text-foreground/60 mb-6">
              {searchQuery
                ? `We couldn't find any results for "${searchQuery}". Try adjusting your search terms.`
                : "Start typing to search for events, vendors, or users"}
            </p>
            <div className="text-sm text-foreground/50">
              <p>Try searching for:</p>
              <ul className="mt-2 space-y-1">
                <li>• Event names or categories</li>
                <li>• Vendor services or locations</li>
                <li>• User names or usernames</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;

