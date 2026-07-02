"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, PlusCircle, CheckCircle, CalendarBlank, Gear } from '@phosphor-icons/react';
import { CommunityService } from "@/services/community";
import { CommunityPublic } from "@/types/community";
import { useUserStore } from "@/store/useUserStore";
import { getTicketPriceInfo } from "@/utils/ticket-pricing";
import EventCard from "@/components/Homepage/EventCard";
import Button from "@/components/Button";
import customToast from "@/lib/toast";
import CommunityDiscussions from "./CommunityDiscussions";

interface CommunityPageProps {
  slug: string;
  initialData?: CommunityPublic | null;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ slug, initialData }) => {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const [community, setCommunity] = useState<CommunityPublic | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [notFound, setNotFound] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "discussions">("events");

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        const data = await CommunityService.getBySlug(slug);
        setCommunity(data);
        setNotFound(false);
      } catch (err) {
        console.error("Failed to fetch community:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [slug]);

  const handleFollow = async () => {
    if (!community || followLoading) return;

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/c/${slug}`);
      return;
    }

    setFollowLoading(true);
    try {
      if (community.isFollowing) {
        await CommunityService.unfollow(community.id);
        setCommunity({
          ...community,
          isFollowing: false,
          followersCount: Math.max(0, community.followersCount - 1),
        });
      } else {
        await CommunityService.follow(community.id);
        setCommunity({
          ...community,
          isFollowing: true,
          followersCount: community.followersCount + 1,
        });
        customToast.success(`You're now following ${community.name}`);
      }
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading && !community) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound || !community) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">Community not found</h1>
        <p className="text-foreground/60">This community may have been removed or never existed.</p>
      </div>
    );
  }

  const mappedEvents = community.upcomingEvents.map((event: any) => {
    const { label, count } = getTicketPriceInfo(event.tickets);
    return {
      id: event.id,
      title: event.title,
      slug: event.slug || undefined,
      date: new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: `${event.startTime} - ${event.endTime}`,
      location: event.venueName || event.city || "Online",
      price: label,
      ticketCount: count,
      category: event.category,
      attendees: event.attendeesCount || 0,
      image: event.coverImage,
      locationType: event.locationType,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        {community.bannerImage && (
          <Image src={community.bannerImage} alt={community.name} fill className="object-cover" priority />
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16 pb-6 border-b border-foreground/10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-foreground/5 border-4 border-background shadow-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
              {community.logo ? (
                <Image
                  src={community.logo}
                  alt={community.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-foreground/30">
                  {community.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 sm:pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{community.name}</h1>
              <div className="flex items-center gap-2 text-sm text-foreground/60 mt-1">
                <Users size={16} color="currentColor" weight="regular" />
                <span>
                  {community.followersCount.toLocaleString()} follower{community.followersCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="sm:pb-2 flex items-center gap-2">
              {community.myRole && (
                <Link href={`/communities/${community.id}/manage`}>
                  <Button variant="outline" size="md" leftIcon={Gear}>
                    Manage
                  </Button>
                </Link>
              )}
              <Button
                variant={community.isFollowing ? "outline" : "primary"}
                size="md"
                leftIcon={community.isFollowing ? CheckCircle : PlusCircle}
                onClick={handleFollow}
                isLoading={followLoading}
              >
                {community.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>

          {/* Description */}
          {community.description && (
            <p className="text-foreground/70 leading-relaxed mt-6 max-w-3xl">{community.description}</p>
          )}

          {/* Chapters */}
          {community.chapters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {community.chapters.map((chapter) => (
                <span
                  key={chapter.id}
                  className="px-3 py-1 bg-foreground/5 rounded-full text-sm font-medium text-foreground/70 border border-foreground/10"
                >
                  {chapter.name}
                </span>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mt-10 border-b border-foreground/10">
            {(["events", "discussions"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab === "events" ? "Events" : "Discussions"}
              </button>
            ))}
          </div>

          {activeTab === "events" ? (
            <div className="mt-8 pb-16">
              {mappedEvents.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-foreground/10 rounded-2xl">
                  <CalendarBlank size={40} color="currentColor" weight="regular" className="text-foreground/20 mx-auto mb-3" />
                  <p className="text-foreground/60">No upcoming events yet. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mappedEvents.map((event) => (
                    <Link key={event.id} href={event.slug ? `/${event.slug}` : `/events/${event.id}`}>
                      <EventCard {...event} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 pb-16">
              <CommunityDiscussions
                communityId={community.id}
                canParticipate={community.isFollowing || !!community.myRole}
                myRole={community.myRole}
                onRequestFollow={handleFollow}
                followLoading={followLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
