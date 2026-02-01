import { create } from "zustand";

interface MessengerState {
    isOpen: boolean;
    activeEventId: string | null;

    // Actions
    openMessenger: () => void;
    closeMessenger: () => void;
    toggleMessenger: () => void;
    openEventChat: (eventId: string) => void;
    clearActiveEvent: () => void;
}

export const useMessengerStore = create<MessengerState>((set) => ({
    isOpen: false,
    activeEventId: null,

    openMessenger: () => set({ isOpen: true }),
    closeMessenger: () => set({ isOpen: false, activeEventId: null }),
    toggleMessenger: () => set((state) => ({ isOpen: !state.isOpen })),
    openEventChat: (eventId: string) => set({ isOpen: true, activeEventId: eventId }),
    clearActiveEvent: () => set({ activeEventId: null }),
}));
