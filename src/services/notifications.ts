import axiosInstance from "@/lib/axios";

export interface NotificationItem {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    actionUrl?: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

interface NotificationsResponse {
    notifications: NotificationItem[];
    hasMore: boolean;
}

export const NotificationService = {
    getNotifications: async (params?: {
        limit?: number;
        before?: string;
        unread?: boolean;
        type?: string;
    }): Promise<NotificationsResponse> => {
        const response = await axiosInstance.get<ApiResponse<NotificationsResponse>>(
            "/notifications",
            { params }
        );
        return response.data.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await axiosInstance.get<ApiResponse<{ count: number }>>(
            "/notifications/unread-count"
        );
        return response.data.data.count;
    },

    markAsRead: async (id: string): Promise<void> => {
        await axiosInstance.patch(`/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await axiosInstance.patch("/notifications/read-all");
    },

    deleteNotification: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/notifications/${id}`);
    },
};
