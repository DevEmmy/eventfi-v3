import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role?: string;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    setUser: (user: User, token?: string) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,
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
