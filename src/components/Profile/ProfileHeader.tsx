"use client";

import React from "react";
import { User, Location, TickCircle, Edit2, Share, AddCircle, CloseCircle } from "iconsax-react";
import Button from "@/components/Button";

interface ProfileHeaderProps {
  username: string;
  displayName: string;
  bio?: string;
  location?: string;
  avatar?: string;
  isVerified?: boolean;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  roles?: string[];
  stats: {
    eventsHosted: number;
    eventsAttended: number;
    followers: number;
    following: number;
  };
  onFollow?: () => void;
  onEdit?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  displayName,
  bio,
  location,
  avatar,
  isVerified = false,
  isOwnProfile = false,
  isFollowing = false,
  roles = [],
  stats,
  onFollow,
  onEdit,
}) => {
  return (
    <div className="border-b border-foreground/10 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto py-8 lg:py-12">
          {/* Profile Info */}
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-foreground/10 flex items-center justify-center border-4 border-background overflow-hidden">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    size={48}
                    color="currentColor"
                    variant="Bold"
                    className="text-foreground/40"
                  />
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              {/* Name and Verification */}
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  {displayName}
                </h1>
                {isVerified && (
                  <TickCircle
                    size={24}
                    color="currentColor"
                    variant="Bold"
                    className="text-primary shrink-0"
                  />
                )}
              </div>

              {/* Username */}
              <p className="text-foreground/60 mb-3">@{username}</p>

              {/* Roles */}
              {roles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-foreground/5 rounded-full text-sm font-medium text-foreground/70 border border-foreground/10"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}

              {/* Bio */}
              {bio && (
                <p className="text-foreground/70 mb-4 leading-relaxed max-w-2xl">
                  {bio}
                </p>
              )}

              {/* Location */}
              {location && (
                <div className="flex items-center gap-2 text-foreground/60 mb-6">
                  <Location size={18} color="currentColor" variant="Outline" />
                  <span>{location}</span>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.eventsHosted}
                  </div>
                  <div className="text-sm text-foreground/60">Events Hosted</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.eventsAttended}
                  </div>
                  <div className="text-sm text-foreground/60">Events Attended</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.followers}
                  </div>
                  <div className="text-sm text-foreground/60">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.following}
                  </div>
                  <div className="text-sm text-foreground/60">Following</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={Edit2}
                    onClick={onEdit}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={isFollowing ? "outline" : "primary"}
                      size="md"
                      leftIcon={isFollowing ? CloseCircle : AddCircle}
                      onClick={onFollow}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="md"
                  leftIcon={Share}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

