import axiosInstance from "@/lib/axios";
import {
    BookingOrder,
    InitiateBookingPayload,
    AttendeeInput,
    PaymentInitResponse,
    TicketType,
    UserTicket,
    InstallmentPlanSchedule
} from "@/types/booking";
import { PaginatedResponse } from "@/types/event";

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

    // Initialize payment (paid tickets) — routes through Paystack hosted checkout
    initializePayment: async (orderId: string, callbackUrl: string): Promise<PaymentInitResponse> => {
        const response = await axiosInstance.post<ApiResponse<PaymentInitResponse>>(`/bookings/${orderId}/pay`, { paymentMethod: 'paystack', callbackUrl });
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

    // Get user's orders (includes installment plan schedule when present)
    getUserOrders: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<BookingOrder>> => {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<BookingOrder>>>('/users/me/orders', { params });
        return response.data.data;
    },

    // Get an order's installment schedule
    getInstallments: async (orderId: string): Promise<InstallmentPlanSchedule> => {
        const response = await axiosInstance.get<ApiResponse<InstallmentPlanSchedule>>(`/bookings/${orderId}/installments`);
        return response.data.data;
    },

    // Initialize payment for a single installment — routes through Paystack hosted checkout
    payInstallment: async (orderId: string, installmentId: string, callbackUrl: string): Promise<PaymentInitResponse & { sequence: number; amount: number }> => {
        const response = await axiosInstance.post<ApiResponse<PaymentInitResponse & { sequence: number; amount: number }>>(
            `/bookings/${orderId}/installments/${installmentId}/pay`,
            { callbackUrl }
        );
        return response.data.data;
    },
};
