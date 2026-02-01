import axiosInstance from "@/lib/axios";
import {
    UserSettings,
    SettingsUpdate,
    ChangePasswordPayload,
    DeleteAccountPayload,
} from "@/types/settings";

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

export const SettingsService = {
    /**
     * Get current user's settings
     * @returns UserSettings object
     */
    getSettings: async (): Promise<UserSettings> => {
        const response = await axiosInstance.get<ApiResponse<UserSettings>>("/users/me/settings");
        return response.data.data;
    },

    /**
     * Update user settings (partial update)
     * @param data Partial settings to update
     * @returns Updated UserSettings
     */
    updateSettings: async (data: SettingsUpdate): Promise<UserSettings> => {
        const response = await axiosInstance.patch<ApiResponse<UserSettings>>("/users/me/settings", data);
        return response.data.data;
    },

    /**
     * Update notification settings only
     * @param data Partial notification settings
     * @returns Updated UserSettings
     */
    updateNotifications: async (data: Partial<UserSettings["notifications"]>): Promise<UserSettings> => {
        const response = await axiosInstance.patch<ApiResponse<UserSettings>>("/users/me/settings/notifications", data);
        return response.data.data;
    },

    /**
     * Update privacy settings only
     * @param data Partial privacy settings
     * @returns Updated UserSettings
     */
    updatePrivacy: async (data: Partial<UserSettings["privacy"]>): Promise<UserSettings> => {
        const response = await axiosInstance.patch<ApiResponse<UserSettings>>("/users/me/settings/privacy", data);
        return response.data.data;
    },

    /**
     * Change user password
     * @param data Password change payload
     */
    changePassword: async (data: ChangePasswordPayload): Promise<void> => {
        await axiosInstance.post("/auth/change-password", data);
    },

    /**
     * Delete user account (30-day soft delete)
     * @param data Account deletion payload with password confirmation
     */
    deleteAccount: async (data: DeleteAccountPayload): Promise<void> => {
        await axiosInstance.post("/auth/delete-account", data);
    },

    /**
     * Logout current session
     */
    logout: async (): Promise<void> => {
        await axiosInstance.post("/auth/logout");
    },

    /**
     * Logout all devices/sessions
     */
    logoutAll: async (): Promise<void> => {
        await axiosInstance.post("/auth/logout-all");
    },
};
