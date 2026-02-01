import axiosInstance from "@/lib/axios";
import {
    BookingOrder,
    InitiateBookingPayload,
    AttendeeInput,
    PaymentMethod,
    PaymentInitResponse,
    TicketType,
    UserTicket
} from "@/types/booking";

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

export const BookingService = {
    // Get ticket types for an event
    getTicketTypes: async (eventId: string): Promise<TicketType[]> => {
        const response = await axiosInstance.get<ApiResponse<TicketType[]>>(`/events/${eventId}/tickets`);
        return response.data.data;
    },

    // Initiate a booking
    initiateBooking: async (data: InitiateBookingPayload): Promise<BookingOrder> => {
        const response = await axiosInstance.post<ApiResponse<BookingOrder>>('/bookings/initiate', data);
        return response.data.data;
    },

    // Get order details
    getOrder: async (orderId: string): Promise<BookingOrder> => {
        const response = await axiosInstance.get<ApiResponse<BookingOrder>>(`/bookings/${orderId}`);
        return response.data.data;
    },

    // Update attendees
    updateAttendees: async (orderId: string, attendees: AttendeeInput[]): Promise<BookingOrder> => {
        const response = await axiosInstance.patch<ApiResponse<BookingOrder>>(`/bookings/${orderId}/attendees`, { attendees });
        return response.data.data;
    },

    // Apply promo code
    applyPromo: async (orderId: string, promoCode: string): Promise<BookingOrder> => {
        const response = await axiosInstance.post<ApiResponse<BookingOrder>>(`/bookings/${orderId}/promo`, { promoCode });
        return response.data.data;
    },

    // Initialize payment (paid tickets)
    initializePayment: async (orderId: string, paymentMethod: PaymentMethod, callbackUrl: string): Promise<PaymentInitResponse> => {
        const response = await axiosInstance.post<ApiResponse<PaymentInitResponse>>(`/bookings/${orderId}/pay`, { paymentMethod, callbackUrl });
        return response.data.data;
    },

    // Confirm order (free tickets)
    confirmFreeOrder: async (orderId: string, attendees: AttendeeInput[]): Promise<any> => {
        const response = await axiosInstance.post<ApiResponse<any>>(`/bookings/${orderId}/confirm`, { attendees });
        return response.data.data;
    },

    // Cancel order
    cancelOrder: async (orderId: string): Promise<void> => {
        await axiosInstance.delete(`/bookings/${orderId}`);
    },

    // Get user's tickets
    getUserTickets: async (params?: { status?: string; upcoming?: boolean, page?: number, limit?: number }): Promise<any> => {
        const response = await axiosInstance.get('/users/me/tickets', { params });
        // Assuming the API returns paginated response in data.data or similar, 
        // adapting to match what UserService.getUserTickets was likely doing or what's expected.
        // Based on previous patterns, let's return response.data.data
        return response.data.data;
    },
};
