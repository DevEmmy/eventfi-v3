export enum EventCategory {
    MUSIC = 'MUSIC',
    TECH = 'TECH',
    BUSINESS = 'BUSINESS',
    ARTS = 'ARTS',
    SPORTS = 'SPORTS',
    EDUCATION = 'EDUCATION',
    ENTERTAINMENT = 'ENTERTAINMENT',
    COMMUNITY = 'COMMUNITY',
    WELLNESS = 'WELLNESS',
    FOOD_DRINK = 'FOOD_DRINK',
    OTHER = 'OTHER'
}

export enum EventStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    RESCHEDULED = 'RESCHEDULED'
}

export enum EventPrivacy {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    UNLISTED = 'UNLISTED'
}

export enum TicketType {
    FREE = 'FREE',
    PAID = 'PAID',
    DONATION = 'DONATION'
}

export interface EventLocation {
    type: 'PHYSICAL' | 'ONLINE' | 'HYBRID';
    address?: string; // Full address string
    venueName?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    onlineUrl?: string; // Zoom/Google Meet link
    onlinePassword?: string;
}

export interface EventSchedule {
    startDate: string; // ISO 8601
    endDate: string; // ISO 8601
    startTime: string; // HH:mm (24h)
    endTime: string; // HH:mm (24h)
    timezone: string; // e.g., 'America/New_York'
}

export interface EventTicket {
    id?: string;
    name: string; // e.g., "General Admission", "VIP"
    description?: string;
    type: TicketType;
    price: number;
    currency: string; // e.g., "USD", "NGN"
    quantity: number; // Total available
    remaining?: number;
    maxPerUser?: number;
    salesStart?: string; // ISO 8601
    salesEnd?: string; // ISO 8601
}

export interface EventMedia {
    coverImage: string; // Main banner
    gallery?: string[]; // Additional images
    videoUrl?: string; // Promotional video
}

export interface EventOrganizer {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    contactEmail?: string;
    isVerified?: boolean;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    shortDescription?: string; // For cards/previews
    category: EventCategory;
    tags?: string[];

    status: EventStatus;
    privacy: EventPrivacy;

    location: EventLocation;
    schedule: EventSchedule;
    media: EventMedia;

    tickets: EventTicket[];

    organizer: EventOrganizer;

    // Metadata
    isFeatured?: boolean;
    attendeesCount?: number;
    favoritesCount?: number;
    createdAt: string;
    updatedAt: string;
}

// Payload for creating a new event (partial of Event)
export interface CreateEventPayload {
    title: string;
    description: string;
    category: EventCategory;
    tags?: string[];
    privacy: EventPrivacy;

    location: EventLocation;
    schedule: EventSchedule;
    media: EventMedia;

    tickets: EventTicket[];
}

export interface EventQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: EventCategory;
    type?: 'PHYSICAL' | 'ONLINE' | 'HYBRID';
    city?: string;
    country?: string;
    startDate?: string;
    endDate?: string;
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    meta: Meta;
    data: T[];
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data: T;
}

// Review types
export interface Review {
    id: string;
    eventId?: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number; // 1-5
    title?: string;
    comment: string;
    createdAt: string; // ISO 8601
    helpfulCount: number;
    photos?: string[];
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export interface CreateReviewPayload {
    rating: number;
    title?: string;
    comment: string;
    photos?: string[];
}

// Schedule item for detailed event itinerary
export interface ScheduleItem {
    time: string;
    activity: string;
    description?: string;
    order?: number;
}
