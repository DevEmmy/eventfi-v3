import axiosInstance from "@/lib/axios";

export type ActivityType = "LUCKY_DRAW" | "APPLAUSE_METER";
export type ActivityStatus = "IDLE" | "ACTIVE" | "ENDED";

export interface EventActivity {
    id: string;
    eventId: string;
    type: ActivityType;
    status: ActivityStatus;
    config: Record<string, any>;
    results: Record<string, any> | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface ActivitySummary extends EventActivity {
    _count: { entries: number };
}

export interface ActivityLeaderboardEntry {
    userId: string;
    name: string;
    avatar: string | null;
    username: string | null;
    taps: number;
}

export interface ActivityWinner {
    userId: string;
    name: string;
    avatar: string | null;
    username: string | null;
}

export interface ActivityDetail extends EventActivity {
    participantCount: number;
    // Lucky Draw
    winners?: ActivityWinner[];
    totalPool?: number;
    drawnAt?: string | null;
    // Applause Meter
    leaderboard?: ActivityLeaderboardEntry[];
    totalTaps?: number;
}

export interface DrawResult {
    winners: Array<{
        userId: string;
        name: string;
        avatar: string | null;
        username: string | null;
    }>;
    totalPool: number;
    activity: EventActivity;
}

export interface TapResult {
    totalTaps: number;
    participantCount: number;
    myTaps: number;
    leaderboard: Array<{
        userId: string;
        name: string;
        avatar: string | null;
        taps: number;
    }>;
}

export const ActivityService = {
    // Organizer: create a new activity
    create: async (
        eventId: string,
        type: ActivityType,
        config: Record<string, any> = {}
    ): Promise<EventActivity> => {
        const res = await axiosInstance.post(`/events/${eventId}/activities`, {
            type,
            config,
        });
        return res.data.data;
    },

    // Organizer: list all activities for event (with entry counts)
    list: async (eventId: string): Promise<ActivitySummary[]> => {
        const res = await axiosInstance.get(`/events/${eventId}/activities`);
        return res.data.data;
    },

    // Organizer: get enriched detail for a specific activity
    getDetail: async (eventId: string, activityId: string): Promise<ActivityDetail> => {
        const res = await axiosInstance.get(`/events/${eventId}/activities/${activityId}`);
        return res.data.data;
    },

    // Anyone: get currently active activity
    getActive: async (eventId: string): Promise<EventActivity | null> => {
        const res = await axiosInstance.get(
            `/events/${eventId}/activities/active`
        );
        return res.data.data;
    },

    // Organizer: start activity
    start: async (
        eventId: string,
        activityId: string
    ): Promise<EventActivity> => {
        const res = await axiosInstance.patch(
            `/events/${eventId}/activities/${activityId}/start`
        );
        return res.data.data;
    },

    // Organizer: end activity
    end: async (
        eventId: string,
        activityId: string
    ): Promise<EventActivity> => {
        const res = await axiosInstance.patch(
            `/events/${eventId}/activities/${activityId}/end`
        );
        return res.data.data;
    },

    // Organizer: trigger lucky draw
    draw: async (eventId: string, activityId: string): Promise<DrawResult> => {
        const res = await axiosInstance.post(
            `/events/${eventId}/activities/${activityId}/draw`
        );
        return res.data.data;
    },

    // Attendee: tap applause
    tap: async (eventId: string, activityId: string): Promise<TapResult> => {
        const res = await axiosInstance.post(
            `/events/${eventId}/activities/${activityId}/tap`
        );
        return res.data.data;
    },
};
