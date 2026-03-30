import { create } from "zustand";
import { EventActivity } from "@/services/activity";

interface DrawWinner {
    userId: string;
    name: string;
    avatar: string | null;
    username: string | null;
}

interface ActivityState {
    // Current active activity (shown to attendees)
    activeActivity: EventActivity | null;
    // Draw result (shown during reveal animation)
    drawWinners: DrawWinner[];
    drawTotalPool: number;
    showDrawReveal: boolean;
    // Countdown before draw reveal (null = no countdown)
    drawCountdown: number | null;
    // Applause state
    totalTaps: number;
    participantCount: number;
    hasUserTapped: boolean;
    // Loading
    isLoading: boolean;

    // Actions
    setActiveActivity: (activity: EventActivity | null) => void;
    setDrawResult: (winners: DrawWinner[], totalPool: number) => void;
    showReveal: () => void;
    hideReveal: () => void;
    setDrawCountdown: (n: number | null) => void;
    setTapCount: (totalTaps: number, participantCount: number) => void;
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
    hasUserTapped: false,
    isLoading: false,
};

export const useActivityStore = create<ActivityState>((set) => ({
    ...initialState,

    setActiveActivity: (activity) => set({ activeActivity: activity }),
    setDrawResult: (winners, totalPool) =>
        set({ drawWinners: winners, drawTotalPool: totalPool }),
    showReveal: () => set({ showDrawReveal: true }),
    hideReveal: () => set({ showDrawReveal: false }),
    setDrawCountdown: (n) => set({ drawCountdown: n }),
    setTapCount: (totalTaps, participantCount) =>
        set({ totalTaps, participantCount }),
    setHasUserTapped: (tapped) => set({ hasUserTapped: tapped }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    reset: () => set(initialState),
}));
