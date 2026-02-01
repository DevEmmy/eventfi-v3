// Event Management Types

export type TeamRole = 'organizer' | 'co-host' | 'manager' | 'assistant';
export type TeamMemberStatus = 'active' | 'pending';
export type AttendeeCheckInStatus = 'checked_in' | 'not_checked_in';
export type CheckInMethod = 'manual' | 'qr_scan';
export type EmailRecipientType = 'all' | 'checked_in' | 'not_checked_in' | 'custom';
export type RefundPolicy = 'full' | 'partial' | 'none';
export type AnalyticsPeriod = '7d' | '30d' | '90d' | 'all';

// Team Permissions
export interface TeamPermissions {
    canEdit: boolean;
    canManageAttendees: boolean;
    canViewAnalytics: boolean;
    canManageTeam: boolean;
}

// Event Stats
export interface EventStats {
    totalTickets: number;
    ticketsSold: number;
    ticketsRemaining: number;
    totalRevenue: number;
    averageTicketPrice: number;
    attendanceRate: number;
    checkIns: number;
    noShows: number;
    refunds: number;
    revenueChange: number;
    salesChange: number;
}

// Ticket Sales Breakdown
export interface TicketSalesBreakdown {
    ticketTypeId: string;
    name: string;
    price: number;
    total: number;
    sold: number;
    remaining: number;
    revenue: number;
}

// Sales Data Point (for charts)
export interface SalesDataPoint {
    date: string;
    ticketsSold: number;
    revenue: number;
}

// Referrer Data
export interface ReferrerData {
    source: string;
    count: number;
}

// Attendee
export interface EventAttendee {
    id: string;
    name: string;
    email: string;
    phone: string;
    ticketTypeId: string;
    ticketTypeName: string;
    ticketPrice: number;
    purchaseDate: string;
    status: AttendeeCheckInStatus;
    checkInTime: string | null;
    orderId: string;
    ticketCode: string;
}

// Team Member
export interface TeamMember {
    id: string;
    userId: string;
    name: string;
    email: string;
    avatar?: string;
    role: TeamRole;
    addedDate: string;
    status: TeamMemberStatus;
    permissions: TeamPermissions;
}

// User Search Result
export interface UserSearchResult {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

// ============ API Response Types ============

// Manage Dashboard Response
export interface ManageDashboardResponse {
    event: {
        id: string;
        title: string;
        coverImage?: string;
        status: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
        venueName?: string;
        address?: string;
        createdAt: string;
    };
    stats: EventStats;
    ticketBreakdown: TicketSalesBreakdown[];
    userRole: TeamRole;
}

// Analytics Response
export interface AnalyticsResponse {
    stats: EventStats;
    ticketBreakdown: TicketSalesBreakdown[];
    salesOverTime: SalesDataPoint[];
    topReferrers: ReferrerData[];
}

// Attendees List Response
export interface AttendeesListResponse {
    attendees: EventAttendee[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Check-in Response
export interface CheckInResponse {
    attendeeId: string;
    checkInTime: string;
    message: string;
}

// Bulk Email Response
export interface BulkEmailResponse {
    emailsSent: number;
    message: string;
}

// Team Members Response
export interface TeamMembersResponse {
    members: TeamMember[];
}

// Add Team Member Response
export interface AddTeamMemberResponse {
    member: TeamMember;
    invitationSent: boolean;
}

// Duplicate Event Response
export interface DuplicateEventResponse {
    id: string;
    title: string;
    status: string;
}

// Cancel Event Response
export interface CancelEventResponse {
    status: string;
    attendeesNotified: number;
    refundsInitiated: number;
}

// ============ Request Payload Types ============

export interface CheckInPayload {
    method: CheckInMethod;
    ticketCode?: string;
}

export interface BulkEmailPayload {
    recipients: EmailRecipientType;
    attendeeIds?: string[];
    subject: string;
    body: string;
}

export interface AddTeamMemberPayload {
    userIdOrEmail: string;
    role: Exclude<TeamRole, 'organizer'>;
}

export interface UpdateTeamMemberPayload {
    role: Exclude<TeamRole, 'organizer'>;
}

export interface DuplicateEventPayload {
    title?: string;
    resetDates?: boolean;
}

export interface CancelEventPayload {
    reason: string;
    notifyAttendees: boolean;
    refundPolicy: RefundPolicy;
}

export interface AttendeesQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | AttendeeCheckInStatus;
    ticketType?: string;
}

export interface UserSearchParams {
    q: string;
    excludeEventTeam?: string;
}
