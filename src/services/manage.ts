import axiosInstance from "@/lib/axios";
import {
    ManageDashboardResponse,
    AnalyticsResponse,
    AttendeesListResponse,
    CheckInResponse,
    BulkEmailResponse,
    TeamMembersResponse,
    AddTeamMemberResponse,
    TeamMember,
    DuplicateEventResponse,
    CancelEventResponse,
    CheckInPayload,
    BulkEmailPayload,
    AddTeamMemberPayload,
    UpdateTeamMemberPayload,
    DuplicateEventPayload,
    CancelEventPayload,
    AttendeesQueryParams,
    UserSearchParams,
    UserSearchResult,
    AnalyticsPeriod,
} from "@/types/manage";

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

export const ManageEventService = {
    /**
     * Get event management dashboard data
     */
    getDashboard: async (eventId: string): Promise<ManageDashboardResponse> => {
        const response = await axiosInstance.get<ApiResponse<ManageDashboardResponse>>(
            `/events/${eventId}/manage`
        );
        return response.data.data;
    },

    /**
     * Get event analytics
     */
    getAnalytics: async (
        eventId: string,
        period: AnalyticsPeriod = "30d"
    ): Promise<AnalyticsResponse> => {
        const response = await axiosInstance.get<ApiResponse<AnalyticsResponse>>(
            `/events/${eventId}/analytics`,
            { params: { period } }
        );
        return response.data.data;
    },

    /**
     * Get event attendees (paginated)
     */
    getAttendees: async (
        eventId: string,
        params?: AttendeesQueryParams
    ): Promise<AttendeesListResponse> => {
        const response = await axiosInstance.get<ApiResponse<AttendeesListResponse>>(
            `/events/${eventId}/attendees`,
            { params }
        );
        return response.data.data;
    },

    /**
     * Check-in an attendee
     */
    checkInAttendee: async (
        eventId: string,
        attendeeId: string,
        payload: CheckInPayload
    ): Promise<CheckInResponse> => {
        const response = await axiosInstance.post<ApiResponse<CheckInResponse>>(
            `/events/${eventId}/attendees/${attendeeId}/check-in`,
            payload
        );
        return response.data.data;
    },

    /**
     * Send bulk email to attendees
     */
    sendBulkEmail: async (
        eventId: string,
        payload: BulkEmailPayload
    ): Promise<BulkEmailResponse> => {
        const response = await axiosInstance.post<ApiResponse<BulkEmailResponse>>(
            `/events/${eventId}/attendees/email`,
            payload
        );
        return response.data.data;
    },

    /**
     * Export attendees list
     */
    exportAttendees: async (
        eventId: string,
        format: "csv" | "xlsx" = "csv",
        status?: "all" | "checked_in" | "not_checked_in"
    ): Promise<Blob> => {
        const response = await axiosInstance.get(`/events/${eventId}/attendees/export`, {
            params: { format, status },
            responseType: "blob",
        });
        return response.data;
    },

    /**
     * Get team members
     */
    getTeamMembers: async (eventId: string): Promise<TeamMembersResponse> => {
        const response = await axiosInstance.get<ApiResponse<TeamMembersResponse>>(
            `/events/${eventId}/team`
        );
        return response.data.data;
    },

    /**
     * Add a team member
     */
    addTeamMember: async (
        eventId: string,
        payload: AddTeamMemberPayload
    ): Promise<AddTeamMemberResponse> => {
        const response = await axiosInstance.post<ApiResponse<AddTeamMemberResponse>>(
            `/events/${eventId}/team`,
            payload
        );
        return response.data.data;
    },

    /**
     * Update team member role
     */
    updateTeamMember: async (
        eventId: string,
        memberId: string,
        payload: UpdateTeamMemberPayload
    ): Promise<TeamMember> => {
        const response = await axiosInstance.patch<ApiResponse<TeamMember>>(
            `/events/${eventId}/team/${memberId}`,
            payload
        );
        return response.data.data;
    },

    /**
     * Remove a team member
     */
    removeTeamMember: async (eventId: string, memberId: string): Promise<void> => {
        await axiosInstance.delete(`/events/${eventId}/team/${memberId}`);
    },

    /**
     * Duplicate an event
     */
    duplicateEvent: async (
        eventId: string,
        payload?: DuplicateEventPayload
    ): Promise<DuplicateEventResponse> => {
        const response = await axiosInstance.post<ApiResponse<DuplicateEventResponse>>(
            `/events/${eventId}/duplicate`,
            payload || {}
        );
        return response.data.data;
    },

    /**
     * Cancel an event
     */
    cancelEvent: async (
        eventId: string,
        payload: CancelEventPayload
    ): Promise<CancelEventResponse> => {
        const response = await axiosInstance.post<ApiResponse<CancelEventResponse>>(
            `/events/${eventId}/cancel`,
            payload
        );
        return response.data.data;
    },

    /**
     * Search users for team addition
     */
    searchUsers: async (params: UserSearchParams): Promise<UserSearchResult[]> => {
        const response = await axiosInstance.get<ApiResponse<UserSearchResult[]>>(
            `/users/search`,
            { params }
        );
        return response.data.data;
    },

    /**
     * Helper: Download exported file
     */
    downloadExport: async (
        eventId: string,
        format: "csv" | "xlsx" = "csv",
        status?: "all" | "checked_in" | "not_checked_in"
    ): Promise<void> => {
        const blob = await ManageEventService.exportAttendees(eventId, format, status);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `attendees-${eventId}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },
};
