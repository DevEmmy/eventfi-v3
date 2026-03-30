import { create } from "zustand";
import { EventActivity } from "@/services/activity";

export interface DrawWinner {
    userId: string;
    name: string;
    avatar: string | null;
    username: string | null;
}

export interface LeaderboardEntry {
    userId: string;
    name: string;
    avatar: string | null;
    taps: number;
}

interface ActivityState {
    // Current active activity
    activeActivity: EventActivity | null;
    // Lucky Draw
    drawWinners: DrawWinner[];
    drawTotalPool: number;
    showDrawReveal: boolean;
    drawCountdown: number | null;
    // Applause Meter — live state
    totalTaps: number;
    participantCount: number;
    myTaps: number;
    leaderboard: LeaderboardEntry[];
    applauseEndsAt: number | null;
    applauseTimeLeft: number | null;
    // Applause Meter — end results
    applauseResults: LeaderboardEntry[];
    showApplauseResults: boolean;
    hasUserTapped: boolean;
    // Loading
    isLoading: boolean;

    // Actions
    setActiveActivity: (activity: EventActivity | null) => void;
    setDrawResult: (winners: DrawWinner[], totalPool: number) => void;
    showReveal: () => void;
    hideReveal: () => void;
    setDrawCountdown: (n: number | null) => void;
    setTapCount: (totalTaps: number, participantCount: number, myTaps?: number, leaderboard?: LeaderboardEntry[]) => void;
    setMyTaps: (n: number) => void;
    setApplauseDuration: (durationSeconds: number) => void;
    setApplauseTimeLeft: (n: number | null) => void;
    captureApplauseResults: () => void;
    hideApplauseResults: () => void;
    setHasUserTapped: (tapped: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    reset: () => void;
}

const initialState = {
    activeActivity: null,
    drawWinners: [],
    drawTotalPool: 0,
    showDrawReveal: false,
    drawCountdown: null as number | null,
    totalTaps: 0,
    participantCount: 0,
    myTaps: 0,
    leaderboard: [] as LeaderboardEntry[],
    applauseEndsAt: null as number | null,
    applauseTimeLeft: null as number | null,
    applauseResults: [] as LeaderboardEntry[],
    showApplauseResults: false,
    hasUserTapped: false,
    isLoading: false,
};

export const useActivityStore = create<ActivityState>((set, get) => ({
    ...initialState,

    setActiveActivity: (activity) => set({ activeActivity: activity }),
    setDrawResult: (winners, totalPool) =>
        set({ drawWinners: winners, drawTotalPool: totalPool }),
    showReveal: () => set({ showDrawReveal: true }),
    hideReveal: () => set({ showDrawReveal: false }),
    setDrawCountdown: (n) => set({ drawCountdown: n }),
    setTapCount: (totalTaps, participantCount, myTaps, leaderboard) =>
        set((s) => ({
            totalTaps,
            participantCount,
            myTaps: myTaps ?? s.myTaps,
            leaderboard: leaderboard ?? s.leaderboard,
        })),
    setMyTaps: (n) => set({ myTaps: n }),
    setApplauseDuration: (durationSeconds) =>
        set({ applauseEndsAt: Date.now() + durationSeconds * 1000 }),
    setApplauseTimeLeft: (n) => set({ applauseTimeLeft: n }),
    captureApplauseResults: () =>
        set((s) => ({ applauseResults: s.leaderboard, showApplauseResults: true })),
    hideApplauseResults: () => set({ showApplauseResults: false }),
    setHasUserTapped: (tapped) => set({ hasUserTapped: tapped }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    reset: () => set(initialState),
}));
