import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/event";
import {
    ChapterEventsResult,
    CommunityChapter,
    CommunityDetail,
    CommunityMember,
    CommunityOverview,
    CommunityPublic,
    CreateCommunityInput,
    InviteMemberInput,
    MyCommunity,
    UpdateMemberInput,
} from "@/types/community";

/**
 * Service to handle Community API calls (public + organizer-facing)
 */
export const CommunityService = {
    /**
     * Fetch a community's public page data by its slug.
     */
    getBySlug: async (slug: string): Promise<CommunityPublic> => {
        const response = await axiosInstance.get<ApiResponse<CommunityPublic>>(`/communities/slug/${slug}`);
        return response.data.data;
    },

    /**
     * Follow a community.
     */
    follow: async (communityId: string): Promise<void> => {
        await axiosInstance.post(`/communities/${communityId}/follow`);
    },

    /**
     * Unfollow a community.
     */
    unfollow: async (communityId: string): Promise<void> => {
        await axiosInstance.delete(`/communities/${communityId}/follow`);
    },

    /**
     * Create a new community. The creator becomes its OWNER.
     */
    create: async (data: CreateCommunityInput): Promise<CommunityDetail> => {
        const response = await axiosInstance.post<ApiResponse<CommunityDetail>>(`/communities`, data);
        return response.data.data;
    },

    /**
     * List all communities the current user is a member of.
     */
    listMine: async (): Promise<MyCommunity[]> => {
        const response = await axiosInstance.get<ApiResponse<MyCommunity[]>>(`/communities/mine`);
        return response.data.data;
    },

    /**
     * Get a community's details (members included for OWNER/ADMIN).
     */
    getOne: async (communityId: string): Promise<CommunityDetail> => {
        const response = await axiosInstance.get<ApiResponse<CommunityDetail>>(`/communities/${communityId}`);
        return response.data.data;
    },

    /**
     * Update community details. Requires OWNER/ADMIN.
     */
    update: async (communityId: string, data: Partial<CreateCommunityInput>): Promise<CommunityDetail> => {
        const response = await axiosInstance.patch<ApiResponse<CommunityDetail>>(`/communities/${communityId}`, data);
        return response.data.data;
    },

    /**
     * Delete a community. Requires OWNER.
     */
    remove: async (communityId: string): Promise<void> => {
        await axiosInstance.delete(`/communities/${communityId}`);
    },

    // ==================== CHAPTERS ====================

    /**
     * Create a chapter within a community. Requires OWNER/ADMIN.
     */
    createChapter: async (communityId: string, data: { name: string }): Promise<CommunityChapter> => {
        const response = await axiosInstance.post<ApiResponse<CommunityChapter>>(`/communities/${communityId}/chapters`, data);
        return response.data.data;
    },

    /**
     * Rename a chapter. Requires OWNER/ADMIN.
     */
    updateChapter: async (communityId: string, chapterId: string, data: { name: string }): Promise<CommunityChapter> => {
        const response = await axiosInstance.patch<ApiResponse<CommunityChapter>>(`/communities/${communityId}/chapters/${chapterId}`, data);
        return response.data.data;
    },

    /**
     * Delete a chapter. Requires OWNER/ADMIN. Fails if the chapter has events.
     */
    deleteChapter: async (communityId: string, chapterId: string): Promise<void> => {
        await axiosInstance.delete(`/communities/${communityId}/chapters/${chapterId}`);
    },

    /**
     * Paginated list of events within a chapter.
     */
    getChapterEvents: async (communityId: string, chapterId: string, params?: { page?: number; limit?: number }): Promise<ChapterEventsResult> => {
        const response = await axiosInstance.get<ApiResponse<ChapterEventsResult>>(`/communities/${communityId}/chapters/${chapterId}/events`, { params });
        return response.data.data;
    },

    // ==================== MEMBERS ====================

    /**
     * List all members of a community. Requires OWNER/ADMIN.
     */
    listMembers: async (communityId: string): Promise<CommunityMember[]> => {
        const response = await axiosInstance.get<ApiResponse<CommunityMember[]>>(`/communities/${communityId}/members`);
        return response.data.data;
    },

    /**
     * Invite a user (by id or email) to a community. Requires OWNER/ADMIN.
     */
    inviteMember: async (communityId: string, data: InviteMemberInput): Promise<CommunityMember> => {
        const response = await axiosInstance.post<ApiResponse<CommunityMember>>(`/communities/${communityId}/members`, data);
        return response.data.data;
    },

    /**
     * Update a member's role/chapter scope. Requires OWNER/ADMIN.
     */
    updateMember: async (communityId: string, memberId: string, data: UpdateMemberInput): Promise<CommunityMember> => {
        const response = await axiosInstance.patch<ApiResponse<CommunityMember>>(`/communities/${communityId}/members/${memberId}`, data);
        return response.data.data;
    },

    /**
     * Remove a member from a community. Requires OWNER/ADMIN.
     */
    removeMember: async (communityId: string, memberId: string): Promise<void> => {
        await axiosInstance.delete(`/communities/${communityId}/members/${memberId}`);
    },

    /**
     * Accept a pending community invitation.
     */
    acceptInvite: async (token: string): Promise<{ message: string; communityId: string }> => {
        const response = await axiosInstance.post<ApiResponse<{ message: string; communityId: string }>>(`/communities/accept`, { token });
        return response.data.data;
    },

    // ==================== OVERVIEW ====================

    /**
     * Cross-chapter dashboard for OWNER/ADMIN.
     */
    getOverview: async (communityId: string): Promise<CommunityOverview> => {
        const response = await axiosInstance.get<ApiResponse<CommunityOverview>>(`/communities/${communityId}/overview`);
        return response.data.data;
    },
};
