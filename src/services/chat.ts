import axiosInstance from "@/lib/axios";
import {
    JoinChatResponse,
    ChatMessagesResponse,
    ChatMessage,
    ChatMembersResponse,
    SendMessagePayload,
    ModerateMessagePayload,
    MuteUserPayload,
    UpdateChatSettingsPayload,
    MessagesQueryParams,
    MembersQueryParams,
} from "@/types/chat";

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

export const ChatService = {
    /**
     * Get/join event chat
     */
    joinChat: async (eventId: string): Promise<JoinChatResponse> => {
        const response = await axiosInstance.get<ApiResponse<JoinChatResponse>>(
            `/events/${eventId}/chat`
        );
        return response.data.data;
    },

    /**
     * Get chat message history (paginated)
     */
    getMessages: async (
        eventId: string,
        params?: MessagesQueryParams
    ): Promise<ChatMessagesResponse> => {
        const response = await axiosInstance.get<ApiResponse<ChatMessagesResponse>>(
            `/events/${eventId}/chat/messages`,
            { params }
        );
        return response.data.data;
    },

    /**
     * Get pinned messages
     */
    getPinnedMessages: async (eventId: string): Promise<ChatMessage[]> => {
        const response = await axiosInstance.get<ApiResponse<ChatMessage[]>>(
            `/events/${eventId}/chat/messages/pinned`
        );
        return response.data.data;
    },

    /**
     * Send a message (REST fallback when WebSocket unavailable)
     */
    sendMessage: async (
        eventId: string,
        payload: SendMessagePayload
    ): Promise<ChatMessage> => {
        const response = await axiosInstance.post<ApiResponse<ChatMessage>>(
            `/events/${eventId}/chat/messages`,
            payload
        );
        return response.data.data;
    },

    /**
     * Moderate a message (delete/pin/unpin)
     */
    moderateMessage: async (
        eventId: string,
        messageId: string,
        payload: ModerateMessagePayload
    ): Promise<void> => {
        await axiosInstance.patch(
            `/events/${eventId}/chat/messages/${messageId}`,
            payload
        );
    },

    /**
     * Get chat members
     */
    getMembers: async (
        eventId: string,
        params?: MembersQueryParams
    ): Promise<ChatMembersResponse> => {
        const response = await axiosInstance.get<ApiResponse<ChatMembersResponse>>(
            `/events/${eventId}/chat/members`,
            { params }
        );
        return response.data.data;
    },

    /**
     * Mute/unmute a user
     */
    muteUser: async (
        eventId: string,
        userId: string,
        payload: MuteUserPayload
    ): Promise<void> => {
        await axiosInstance.post(
            `/events/${eventId}/chat/members/${userId}/mute`,
            payload
        );
    },

    /**
     * Update chat settings (organizer only)
     */
    updateSettings: async (
        eventId: string,
        payload: UpdateChatSettingsPayload
    ): Promise<void> => {
        await axiosInstance.patch(`/events/${eventId}/chat/settings`, payload);
    },
};
