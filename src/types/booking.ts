
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'expired';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'bank_transfer' | 'mobile_money' | 'free';

export interface TicketType {
    id: string;
    eventId: string;
    name: string;              // "Regular", "VIP", "Early Bird"
    type: 'FREE' | 'REGULAR' | 'VIP' | 'EARLY_BIRD';
    price: number;             // 0 for free tickets
    currency: string;          // "NGN", "USD"
    quantity: number;          // Total available
    sold: number;              // Already sold
    maxPerOrder: number;       // Max tickets per order
    salesStartDate?: string;
    salesEndDate?: string;
    description?: string;
    benefits?: string[];
}

export interface OrderItem {
    ticketTypeId: string;
    ticketTypeName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface AttendeeInput {
    ticketTypeId: string;
    name: string;
    email: string;
    phone?: string;
}

export interface BookingOrder {
    id: string;
    userId: string;
    eventId: string;
    event: {
        id: string;
        title: string;
        coverImage?: string;
        startDate: string;
        venueName?: string;
        city?: string;
    };
    items: OrderItem[];
    subtotal: number;
    serviceFee: number;
    discount: number;
    total: number;
    currency: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    promoCode?: string;
    expiresAt?: string;
    createdAt: string;
}

export interface InitiateBookingPayload {
    eventId: string;
    items: { ticketTypeId: string; quantity: number }[];
}

export interface PaymentInitResponse {
    paymentUrl: string;
    reference: string;
    expiresAt: string;
}

export interface UserTicket {
    id: string;
    ticketCode: string;
    ticketType: { name: string; type: string };
    event: {
        id: string;
        title: string;
        coverImage?: string;
        startDate: string;
        venueName?: string;
        city?: string;
    };
    attendee: { name: string; email: string };
    status: 'valid' | 'used' | 'cancelled' | 'expired';
    checkedIn: boolean;
    purchasedAt: string;
}
