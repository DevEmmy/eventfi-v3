import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '@/lib/axios';

export interface UserStats {
    eventsHosted: number;
    eventsAttended: number;
    followers: number;
    following: number;
}

export interface SocialLinks {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
}

export interface User {
    id: string;
    email: string;
    username: string | null;
    displayName: string | null;
    isVerified: boolean;
    avatar?: string | null;
    bio?: string | null;
    location?: string | null;
    website?: string | null;
    socialLinks?: SocialLinks | null;
    roles?: string[];
    stats?: UserStats;
    createdAt?: string;
    lastLoginAt?: string;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    setUser: (user: User, token?: string) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,
            loading: false,
            setUser: (user, token) => {
                if (token) {
                    localStorage.setItem('token', token);
                }
                set({ user, isAuthenticated: true, token: token || null });
            },
            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, isAuthenticated: false, token: null });
                window.location.href = '/auth/login';
            },
            fetchUser: async () => {
                set({ loading: true });
                try {
                    const response = await axiosInstance.get('/auth/me');
                    if (response.data.status === 'success' && response.data.data) {
                        set({ user: response.data.data, isAuthenticated: true, loading: false });
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                token: state.token
            }),
        }
    )
);

