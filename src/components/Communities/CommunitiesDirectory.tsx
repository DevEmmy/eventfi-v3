"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass, Users, CalendarBlank, UsersThree } from '@phosphor-icons/react';
import { CommunityService } from "@/services/community";
import { CommunityListItem } from "@/types/community";

type SortOption = "followers" | "events" | "newest";

const SORT_LABELS: Record<SortOption, string> = {
  followers: "Most followers",
  events: "Most events",
  newest: "Newest",
};

const CommunityCard: React.FC<{ community: CommunityListItem }> = ({ community }) => (
  <Link
    href={`/c/${community.slug}`}
    className="group bg-background border border-foreground/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
  >
    <div className="relative h-28 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
      {community.bannerImage && (
        <Image src={community.bannerImage} alt={community.name} fill className="object-cover" />
      )}
    </div>
    <div className="p-5 -mt-8">
      <div className="w-16 h-16 rounded-2xl bg-foreground/5 border-4 border-background shadow-sm overflow-hidden flex items-center justify-center">
        {community.logo ? (
          <Image src={community.logo} alt={community.name} width={64} height={64} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-bold text-foreground/30">{community.name.charAt(0)}</span>
        )}
      </div>
      <h3 className="text-lg font-bold text-foreground mt-3 group-hover:text-primary transition-colors truncate">
        {community.name}
      </h3>
      {community.description && (
        <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{community.description}</p>
      )}
      <div className="flex items-center gap-4 mt-4 text-sm text-foreground/60">
        <div className="flex items-center gap-1.5">
          <Users size={16} color="currentColor" weight="regular" />
          <span>{community.followersCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarBlank size={16} color="currentColor" weight="regular" />
          <span>{community.eventsCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  </Link>
);

const CommunitiesDirectory: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("followers");
  const [communities, setCommunities] = useState<CommunityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCommunities = useCallback(async (targetPage: number, append: boolean) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const result = await CommunityService.listPublic({
        page: targetPage,
        limit: 12,
        search: search || undefined,
        sort,
      });
      setCommunities((prev) => (append ? [...prev, ...result.communities] : result.communities));
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Failed to load communities:", err);
      if (!append) setCommunities([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, sort]);

  useEffect(() => {
    fetchCommunities(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <UsersThree size={28} color="currentColor" weight="fill" className="text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
              Discover Communities
            </h1>
            <p className="text-foreground/60 text-lg">Find and follow communities hosting events near you</p>
          </div>

          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <MagnifyingGlass size={20} color="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search communities by name or description…"
                className="w-full pl-11 pr-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            >
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-background border border-foreground/10 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-28 bg-foreground/10" />
                  <div className="p-5 -mt-8">
                    <div className="w-16 h-16 rounded-2xl bg-foreground/10 border-4 border-background" />
                    <div className="h-5 w-2/3 bg-foreground/10 rounded mt-3" />
                    <div className="h-4 w-full bg-foreground/5 rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : communities.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-foreground/10 rounded-2xl">
              <p className="text-foreground/60">
                {search ? `No communities found for "${search}"` : "No communities to show yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>

              {page < totalPages && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => fetchCommunities(page + 1, true)}
                    disabled={loadingMore}
                    className="px-8 py-3 rounded-2xl font-semibold border border-foreground/10 text-foreground/70 hover:border-primary/30 hover:text-primary transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitiesDirectory;
