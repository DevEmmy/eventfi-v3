import axiosInstance from "@/lib/axios";
import { ApiResponse, Event, PaginatedResponse } from "@/types/event";
import { Profile, ProfileUpdate } from "@/types/profile";

// Ticket interface for user's purchased tickets
export interface UserTicket {
    id: string;
    eventId: string;
    event: {
        id: string;
        title: string;
        startDate: string;
        startTime: string;
        endTime: string;
        venueName?: string;
        city?: string;
        coverImage?: string;
        category: string;
    };
    ticketType: string;
    ticketName: string;
    quantity: number;
    purchaseDate: string;
    status: "valid" | "used" | "cancelled" | "expired";
    qrCode?: string;
}

// Query params for events
interface UserEventsQueryParams {
    status?: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
    page?: number;
    limit?: number;
}

// Query params for tickets
interface UserTicketsQueryParams {
    status?: "upcoming" | "past";
    page?: number;
    limit?: number;
}

/**
 * Service to handle all User/Profile-related API calls
 */
export const UserService = {
    /**
     * Get current authenticated user's profile
     * @returns Full profile with stats
     */
    getMe: async (): Promise<Profile> => {
        const response = await axiosInstance.get<ApiResponse<Profile>>("/auth/me");
        return response.data.data;
    },

    /**
     * Update current user's profile
     * @param data Profile fields to update
     * @returns Updated profile
     */
    updateProfile: async (data: ProfileUpdate): Promise<Profile> => {
        const response = await axiosInstance.patch<ApiResponse<Profile>>("/auth/profile", data);
        return response.data.data;
    },

    /**
     * Get a public user profile by username
     * @param username User's username
     * @returns Public profile
     */
    getProfileByUsername: async (username: string): Promise<Profile> => {
        const response = await axiosInstance.get<ApiResponse<Profile>>(`/users/${username}`);
        return response.data.data;
    },

    /**
     * Follow a user
     * @param userId User ID to follow
     */
    followUser: async (userId: string): Promise<void> => {
        await axiosInstance.post(`/users/${userId}/follow`);
    },

    /**
     * Unfollow a user
     * @param userId User ID to unfollow
     */
    unfollowUser: async (userId: string): Promise<void> => {
        await axiosInstance.delete(`/users/${userId}/follow`);
    },

    /**
     * Get current user's hosted events
     * @param params Query params for filtering
     * @returns Paginated list of user's events
     */
    getUserEvents: async (params?: UserEventsQueryParams): Promise<PaginatedResponse<Event>> => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Event>>>("/users/me/events", {
            params,
        });
        return response.data.data;
    },

    /**
     * Get current user's purchased tickets
     * @param params Query params for filtering
     * @returns Paginated list of user's tickets
     */
    getUserTickets: async (params?: UserTicketsQueryParams): Promise<PaginatedResponse<UserTicket>> => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<UserTicket>>>("/users/me/tickets", {
            params,
        });
        return response.data.data;
    },

    /**
     * Get current user's saved/favorited events
     * @param page Page number
     * @param limit Items per page
     * @returns Paginated list of favorited events
     */
    getFavorites: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Event>> => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Event>>>("/users/me/favorites", {
            params: { page, limit },
        });
        return response.data.data;
    },

    /**
     * Add event to favorites
     * @param eventId Event ID to favorite
     */
    addFavorite: async (eventId: string): Promise<void> => {
        await axiosInstance.post(`/events/${eventId}/favorite`);
    },

    /**
     * Remove event from favorites
     * @param eventId Event ID to unfavorite
     */
    removeFavorite: async (eventId: string): Promise<void> => {
        await axiosInstance.delete(`/events/${eventId}/favorite`);
    },
};

