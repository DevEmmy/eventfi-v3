import { create } from "zustand";
import {
    ChatMessage,
    ChatMember,
    EventChatInfo,
    ChatRole,
} from "@/types/chat";

interface ChatState {
    // Connection state
    isConnected: boolean;
    isJoining: boolean;
    error: string | null;

    // Chat info
    chatInfo: EventChatInfo | null;
    canJoin: boolean;
    joinError: string | null;

    // Messages
    messages: ChatMessage[];
    pinnedMessages: ChatMessage[];
    hasMoreMessages: boolean;
    isLoadingMessages: boolean;

    // Members
    members: ChatMember[];
    onlineCount: number;
    typingUsers: Array<{ id: string; name: string }>;

    // User state
    userRole: ChatRole | null;
    isMuted: boolean;

    // Actions
    setConnected: (connected: boolean) => void;
    setJoining: (joining: boolean) => void;
    setError: (error: string | null) => void;

    setChatInfo: (info: EventChatInfo | null) => void;
    setCanJoin: (canJoin: boolean, error?: string | null) => void;

    setMessages: (messages: ChatMessage[]) => void;
    addMessage: (message: ChatMessage) => void;
    prependMessages: (messages: ChatMessage[]) => void;
    updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
    removeMessage: (messageId: string) => void;

    setPinnedMessages: (messages: ChatMessage[]) => void;
    addPinnedMessage: (message: ChatMessage) => void;
    removePinnedMessage: (messageId: string) => void;

    setHasMoreMessages: (hasMore: boolean) => void;
    setIsLoadingMessages: (loading: boolean) => void;

    setMembers: (members: ChatMember[]) => void;
    addMember: (member: ChatMember) => void;
    removeMember: (userId: string) => void;
    updateMember: (userId: string, updates: Partial<ChatMember>) => void;

    setOnlineCount: (count: number) => void;
    setTypingUsers: (users: Array<{ id: string; name: string }>) => void;

    setUserRole: (role: ChatRole | null) => void;
    setIsMuted: (muted: boolean) => void;

    reset: () => void;
}

const initialState = {
    isConnected: false,
    isJoining: false,
    error: null,
    chatInfo: null,
    canJoin: false,
    joinError: null,
    messages: [],
    pinnedMessages: [],
    hasMoreMessages: true,
    isLoadingMessages: false,
    members: [],
    onlineCount: 0,
    typingUsers: [],
    userRole: null,
    isMuted: false,
};

export const useChatStore = create<ChatState>((set) => ({
    ...initialState,

    setConnected: (connected) => set({ isConnected: connected }),
    setJoining: (joining) => set({ isJoining: joining }),
    setError: (error) => set({ error }),

    setChatInfo: (info) =>
        set({
            chatInfo: info,
            userRole: info?.userRole || null,
            isMuted: info?.isMuted || false,
        }),

    setCanJoin: (canJoin, error = null) => set({ canJoin, joinError: error }),

    setMessages: (messages) => set({ messages }),

    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    prependMessages: (messages) =>
        set((state) => ({
            messages: [...messages, ...state.messages],
        })),

    updateMessage: (messageId, updates) =>
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
            ),
        })),

    removeMessage: (messageId) =>
        set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== messageId),
        })),

    setPinnedMessages: (messages) => set({ pinnedMessages: messages }),

    addPinnedMessage: (message) =>
        set((state) => ({
            pinnedMessages: [...state.pinnedMessages, message],
        })),

    removePinnedMessage: (messageId) =>
        set((state) => ({
            pinnedMessages: state.pinnedMessages.filter((msg) => msg.id !== messageId),
        })),

    setHasMoreMessages: (hasMore) => set({ hasMoreMessages: hasMore }),
    setIsLoadingMessages: (loading) => set({ isLoadingMessages: loading }),

    setMembers: (members) => set({ members }),

    addMember: (member) =>
        set((state) => ({
            members: [...state.members, member],
            onlineCount: state.onlineCount + 1,
        })),

    removeMember: (userId) =>
        set((state) => ({
            members: state.members.filter((m) => m.userId !== userId),
            onlineCount: Math.max(0, state.onlineCount - 1),
        })),

    updateMember: (userId, updates) =>
        set((state) => ({
            members: state.members.map((m) =>
                m.userId === userId ? { ...m, ...updates } : m
            ),
        })),

    setOnlineCount: (count) => set({ onlineCount: count }),
    setTypingUsers: (users) => set({ typingUsers: users }),

    setUserRole: (role) => set({ userRole: role }),
    setIsMuted: (muted) => set({ isMuted: muted }),

    reset: () => set(initialState),
}));
