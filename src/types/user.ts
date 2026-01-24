/**
 * User Model Interface
 * Represents the core user account data
 */
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string | null;
  isVerified: boolean;
  roles: UserRole[];
  createdAt: Date | string;
  updatedAt: Date | string;
  lastLoginAt?: Date | string;
}

/**
 * User Role Type
 * Defines the different roles a user can have in the platform
 */
export type UserRole = "organizer" | "vendor" | "attendee" | "dual";

/**
 * User Statistics Interface
 * Tracks user activity and engagement metrics
 */
export interface UserStats {
  eventsHosted: number;
  eventsAttended: number;
  followers: number;
  following: number;
}

/**
 * User Authentication Interface
 * Used during authentication and registration
 */
export interface UserAuth {
  email: string;
  password?: string;
  provider?: "google" | "twitter" | "email";
  providerId?: string;
}

/**
 * User Registration Interface
 * Used when creating a new user account
 */
export interface UserRegistration extends UserAuth {
  displayName: string;
  username: string;
}

