import axiosInstance from "@/lib/axios";

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

interface PaginatedResponse<T> {
    meta: { total: number; page: number; limit: number; totalPages: number };
    data: T[];
}

export interface VendorProfile {
    id: string;
    userId: string;
    name: string;
    category: string;
    description: string;
    logo: string | null;
    coverImage: string | null;
    portfolio: string[];
    specialties: string[];
    location: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    priceMin: number | null;
    priceMax: number | null;
    currency: string;
    yearsOfExperience: number;
    availability: "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
    isVerified: boolean;
    averageRating: number;
    reviewCount: number;
    bookingCount: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        displayName: string | null;
        avatar: string | null;
        isVerified: boolean;
    };
    reviews?: VendorReview[];
}

export interface VendorReview {
    id: string;
    vendorId: string;
    userId: string;
    rating: number;
    comment: string;
    photos: string[];
    createdAt: string;
}

export interface VendorBooking {
    id: string;
    vendorId: string;
    userId: string;
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED";
    eventName: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventType: string;
    guestCount: number;
    duration: string | null;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests: string | null;
    estimatedPrice: number | null;
    declineReason: string | null;
    createdAt: string;
    vendor?: {
        id: string;
        name: string;
        category: string;
        logo: string | null;
    };
}

export interface CreateVendorPayload {
    name: string;
    category: string;
    description: string;
    logo?: string;
    coverImage?: string;
    portfolio?: string[];
    specialties?: string[];
    location: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    priceMin?: number;
    priceMax?: number;
    yearsOfExperience?: number;
    availability?: string;
}

export interface VendorQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    location?: string;
    minRating?: number;
}

export interface CreateBookingPayload {
    eventName: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventType: string;
    guestCount?: number;
    duration?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests?: string;
    estimatedPrice?: number;
}

export const VendorService = {
    /**
     * Create a vendor profile
     */
    create: async (data: CreateVendorPayload): Promise<VendorProfile> => {
        const response = await axiosInstance.post<ApiResponse<VendorProfile>>("/vendors", data);
        return response.data.data;
    },

    /**
     * Update a vendor profile
     */
    update: async (id: string, data: Partial<CreateVendorPayload>): Promise<VendorProfile> => {
        const response = await axiosInstance.patch<ApiResponse<VendorProfile>>(`/vendors/${id}`, data);
        return response.data.data;
    },

    /**
     * List vendors with filters
     */
    list: async (params?: VendorQueryParams): Promise<PaginatedResponse<VendorProfile>> => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<VendorProfile>>>("/vendors", { params });
        return response.data.data;
    },

    /**
     * Get vendor by ID
     */
    getById: async (id: string): Promise<VendorProfile> => {
        const response = await axiosInstance.get<ApiResponse<VendorProfile>>(`/vendors/${id}`);
        return response.data.data;
    },

    /**
     * Get current user's vendor profile
     */
    getMyProfile: async (): Promise<VendorProfile> => {
        const response = await axiosInstance.get<ApiResponse<VendorProfile>>("/vendors/me");
        return response.data.data;
    },

    /**
     * Delete vendor profile
     */
    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/vendors/${id}`);
    },

    /**
     * Get vendor reviews
     */
    getReviews: async (vendorId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<VendorReview>> => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<VendorReview>>>(`/vendors/${vendorId}/reviews`, {
            params: { page, limit },
        });
        return response.data.data;
    },

    /**
     * Create a review
     */
    createReview: async (vendorId: string, data: { rating: number; comment: string; photos?: string[] }): Promise<VendorReview> => {
        const response = await axiosInstance.post<ApiResponse<VendorReview>>(`/vendors/${vendorId}/reviews`, data);
        return response.data.data;
    },

    /**
     * Create a booking request
     */
    createBooking: async (vendorId: string, data: CreateBookingPayload): Promise<VendorBooking> => {
        const response = await axiosInstance.post<ApiResponse<VendorBooking>>(`/vendors/${vendorId}/bookings`, data);
        return response.data.data;
    },

    /**
     * Get bookings for a vendor (vendor owner)
     */
    getVendorBookings: async (vendorId: string, status?: string): Promise<VendorBooking[]> => {
        const response = await axiosInstance.get<ApiResponse<VendorBooking[]>>(`/vendors/${vendorId}/bookings`, {
            params: status ? { status } : undefined,
        });
        return response.data.data;
    },

    /**
     * Get bookings made by current user
     */
    getMyBookings: async (): Promise<VendorBooking[]> => {
        const response = await axiosInstance.get<ApiResponse<VendorBooking[]>>("/vendors/me/bookings");
        return response.data.data;
    },

    /**
     * Update booking status (accept/decline)
     */
    updateBookingStatus: async (bookingId: string, status: string, declineReason?: string): Promise<VendorBooking> => {
        const response = await axiosInstance.patch<ApiResponse<VendorBooking>>(`/vendors/bookings/${bookingId}/status`, {
            status,
            declineReason,
        });
        return response.data.data;
    },
};
