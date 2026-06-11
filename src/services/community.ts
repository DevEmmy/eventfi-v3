import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/event";
import { CommunityPublic } from "@/types/community";

/**
 * Service to handle public-facing Community API calls
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
};
