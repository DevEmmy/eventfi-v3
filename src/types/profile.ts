import { User, UserRole, UserStats } from "./user";

/**
 * Profile Model Interface
 * Extends User with profile-specific information and public-facing data
 */
export interface Profile extends User {
  bio?: string;
  location?: string;
  stats: UserStats;
  website?: string;
  socialLinks?: SocialLinks;
  isFollowing?: boolean; // Whether the current user is following this profile
  isOwnProfile?: boolean; // Whether this is the current user's own profile
}

/**
 * Social Links Interface
 * External social media and website links
 */
export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  website?: string;
}

/**
 * Profile Update Interface
 * Fields that can be updated in user profile
 */
export interface ProfileUpdate {
  displayName?: string;
  username?: string;
  bio?: string;
  location?: string;
  avatar?: string | null;
  website?: string;
  socialLinks?: SocialLinks;
}

/**
 * Profile Form Data Interface
 * Used in profile editing forms
 */
export interface ProfileFormData {
  displayName: string;
  username: string;
  bio: string;
  location: string;
  avatar: string | null;
  website?: string;
}

