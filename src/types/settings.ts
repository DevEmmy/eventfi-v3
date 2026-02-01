// Settings-related TypeScript interfaces

export interface NotificationSettings {
    // Communication Channels
    email: boolean;
    push: boolean;
    sms: boolean;

    // Event Notifications
    eventReminders: boolean;
    eventNearby: boolean;
    eventUpdates: boolean;

    // Organizer Notifications
    ticketSales: boolean;

    // Vendor Notifications
    bookingRequests: boolean;
    bookingConfirmations: boolean;

    // General
    reviews: boolean;
    newMessages: boolean;
    paymentNotifications: boolean;
    marketing: boolean;
    locationBased: boolean;
}

export interface PrivacySettings {
    profileVisibility: 'public' | 'private' | 'followers';
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
}

export interface UserSettings {
    id: string;
    userId: string;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    createdAt: string;
    updatedAt: string;
}

export interface SettingsUpdate {
    notifications?: Partial<NotificationSettings>;
    privacy?: Partial<PrivacySettings>;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface DeleteAccountPayload {
    password: string;
    reason?: string;
}
