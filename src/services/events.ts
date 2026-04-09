
import axiosInstance from "@/lib/axios";
import {
    Event,
    CreateEventPayload,
    EventQueryParams,
    ApiResponse,
    PaginatedResponse,
    Review,
    ReviewStats,
    CreateReviewPayload
} from "@/types/event";
import { generateEventSlug } from "@/utils/generateEventSlug";

/**
 * Service to handle all Event-related API calls
 */
export const EventService = {
    /**
     * Look up an event by its short URL slug.
     * Searches events using the slug as a query and matches by comparing slugified titles.
     * @param slug The short URL slug (e.g., "DEVFEST2025")
     * @returns The matching event, or null if not found
     */
    getEventBySlug: async (slug: string): Promise<Event | null> => {
        try {
            const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Event>>>("/events", {
                params: { search: slug, limit: 20 },
            });
            const events = response.data.data.data || [];
            const match = events.find(
                (event: Event) => generateEventSlug(event.title) === slug.toUpperCase()
            );
            return match || null;
        } catch {
            return null;
        }
    },
    /**
     * Create a new event
     * @param data Event creation payload
     * @returns The created event
     */
    createEvent: async (data: CreateEventPayload): Promise<Event> => {
        const response = await axiosInstance.post<ApiResponse<Event>>("/events", data);
        return response.data.data;
    },

    /**
     * Get all public events with filtering and pagination
     * @param params Query parameters for filtering
     * @returns Paginated list of events
     */
    getEvents: async (params?: EventQueryParams): Promise<PaginatedResponse<Event>> => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Event>>>("/events", {
            params,
        });
        return response.data.data;
    },

    /**
     * Get specific event details by ID
     * @param id Event ID
     * @returns Event details
     */
    getEventById: async (id: string): Promise<Event> => {
        const response = await axiosInstance.get<ApiResponse<Event>>(`/events/${id}`);
        return response.data.data;
    },

    /**
     * Update an existing event
     * @param id Event ID
     * @param data Partial event data to update
     * @returns Updated event
     */
    updateEvent: async (id: string, data: Partial<CreateEventPayload>): Promise<Event> => {
        const response = await axiosInstance.patch<ApiResponse<Event>>(`/events/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete an event
     * @param id Event ID
     */
    deleteEvent: async (id: string): Promise<void> => {
        await axiosInstance.delete<ApiResponse<null>>(`/events/${id}`);
    },

    /**
     * Get recommended events for the user
     * @returns List of recommended events
     */
    getRecommendations: async (): Promise<Event[]> => {
        const response = await axiosInstance.get<ApiResponse<Event[]>>("/events/recommendations");
        return response.data.data;
    },

    /**
     * Get related events for a specific event
     * @param id Event ID
     * @param limit Number of related events to return
     * @returns List of related events
     */
    getRelatedEvents: async (id: string, limit: number = 5): Promise<Event[]> => {
        const response = await axiosInstance.get<ApiResponse<Event[]>>(`/events/${id}/related`, {
            params: { limit },
        });
        return response.data.data;
    },

    /**
     * Get reviews for an event
     * @param id Event ID
     * @param page Page number
     * @param limit Items per page
     * @returns Paginated list of reviews
     */
    getReviews: async (id: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Review>> => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Review>>>(`/events/${id}/reviews`, {
            params: { page, limit },
        });
        return response.data.data;
    },

    /**
     * Get review statistics for an event
     * @param id Event ID
     * @returns Review stats including average rating and distribution
     */
    getReviewStats: async (id: string): Promise<ReviewStats> => {
        const response = await axiosInstance.get<ApiResponse<ReviewStats>>(`/events/${id}/reviews/stats`);
        return response.data.data;
    },

    /**
     * Create a review for an event
     * @param id Event ID
     * @param data Review payload
     * @returns Created review
     */
    createReview: async (id: string, data: CreateReviewPayload): Promise<Review> => {
        const response = await axiosInstance.post<ApiResponse<Review>>(`/events/${id}/reviews`, data);
        return response.data.data;
    },

    // ─── Speakers ─────────────────────────────────────────────────────────────

    getSpeakers: async (eventId: string): Promise<EventSpeaker[]> => {
        const response = await axiosInstance.get<ApiResponse<EventSpeaker[]>>(`/events/${eventId}/speakers`);
        return response.data.data;
    },

    addSpeaker: async (eventId: string, data: Omit<EventSpeaker, 'id' | 'eventId' | 'createdAt' | 'updatedAt'>): Promise<EventSpeaker> => {
        const response = await axiosInstance.post<ApiResponse<EventSpeaker>>(`/events/${eventId}/speakers`, data);
        return response.data.data;
    },

    updateSpeaker: async (eventId: string, speakerId: string, data: Partial<EventSpeaker>): Promise<EventSpeaker> => {
        const response = await axiosInstance.patch<ApiResponse<EventSpeaker>>(`/events/${eventId}/speakers/${speakerId}`, data);
        return response.data.data;
    },

    deleteSpeaker: async (eventId: string, speakerId: string): Promise<void> => {
        await axiosInstance.delete(`/events/${eventId}/speakers/${speakerId}`);
    },

    /**
     * Get trending events
     * @param limit Number of events to return
     * @returns List of trending events
     */
    getTrendingEvents: async (limit: number = 10): Promise<Event[]> => {
        const response = await axiosInstance.get<ApiResponse<Event[]>>("/events/trending", {
            params: { limit },
        });
        return response.data.data;
    },

    /**
     * Get current user's hosted events
     */
    getMyEvents: async (params?: { status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Event>> => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Event>>>("/users/me/events", {
            params,
        });
        return response.data.data;
    },

    /**
     * Get organizer dashboard aggregate data
     */
    getOrganizerDashboard: async (): Promise<OrganizerDashboardData> => {
        const response = await axiosInstance.get<ApiResponse<OrganizerDashboardData>>("/users/me/dashboard");
        return response.data.data;
    },
};

export interface EventSpeaker {
    id: string;
    eventId: string;
    name: string;
    title?: string;
    bio?: string;
    avatar?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface OrganizerDashboardData {
    stats: {
        totalEvents: number;
        upcomingEvents: number;
        totalAttendees: number;
        totalRevenue: number;
        totalTicketsSold: number;
        eventsThisMonth: number;
    };
    recentActivity: {
        id: string;
        type: string;
        message: string;
        time: string;
    }[];
    upcomingEventsList: {
        id: string;
        title: string;
        startDate: string;
        endDate: string;
        coverImage: string | null;
        venueName: string | null;
        city: string | null;
        status: string;
        attendeesCount: number;
        ticketsSold: number;
        revenue: number;
    }[];
}
