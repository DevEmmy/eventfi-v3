"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UsersThree, Plus, Gear } from '@phosphor-icons/react';
import Button from "@/components/Button";
import { MyCommunity } from "@/types/community";

interface MyCommunitiesProps {
  communities: MyCommunity[];
  onCreateCommunity?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  CHAPTER_LEAD: "Chapter Lead",
};

const MyCommunities: React.FC<MyCommunitiesProps> = ({ communities, onCreateCommunity }) => {
  if (communities.length === 0) {
    return (
      <div className="bg-background border border-foreground/10 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
          <UsersThree size={40} color="currentColor" weight="regular" className="text-foreground/40" />
        </div>
        <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
          No Communities Yet
        </h3>
        <p className="text-foreground/60 mb-6 max-w-md mx-auto">
          Create a community to organize your events into chapters and bring chapter leads on board.
        </p>
        <Button variant="primary" size="lg" leftIcon={Plus} onClick={onCreateCommunity}>
          Create a Community
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            My Communities
          </h3>
          <p className="text-foreground/60 mt-1">
            {communities.length} {communities.length === 1 ? "community" : "communities"}
          </p>
        </div>
        <Button variant="primary" size="md" leftIcon={Plus} onClick={onCreateCommunity}>
          Create Community
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div
            key={community.id}
            className="rounded-2xl border border-foreground/10 bg-background overflow-hidden hover:border-primary/40 transition-colors"
          >
            <div className="relative h-24 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
              {community.bannerImage && (
                <Image src={community.bannerImage} alt={community.name} fill className="object-cover" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3 -mt-10 mb-3">
                <div className="w-14 h-14 rounded-xl bg-foreground/5 border-4 border-background shadow overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {community.logo ? (
                    <Image src={community.logo} alt={community.name} width={56} height={56} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-foreground/30">{community.name.charAt(0)}</span>
                  )}
                </div>
              </div>

              <h4 className="font-bold text-foreground truncate mb-2">{community.name}</h4>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {community.roles.map((r, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-foreground/5 text-foreground/70 border border-foreground/10"
                  >
                    {ROLE_LABELS[r.role] || r.role}
                    {r.chapter ? ` · ${r.chapter.name}` : ""}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Link href={`/communities/${community.id}/manage`} className="flex-1">
                  <Button variant="primary" size="sm" leftIcon={Gear} fullWidth>
                    Manage
                  </Button>
                </Link>
                <Link href={`/c/${community.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" fullWidth>
                    View Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCommunities;
