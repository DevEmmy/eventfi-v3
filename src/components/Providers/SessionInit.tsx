"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function SessionInit({ children }: { children: React.ReactNode }) {
    const { fetchUser, user, isAuthenticated } = useUserStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        // Skip redirect on auth/onboarding pages to avoid loops
        const isExemptRoute = pathname.startsWith("/auth") || pathname.startsWith("/onboarding");
        if (isExemptRoute) return;

        // If user is authenticated but has no username, redirect to onboarding
        if (isAuthenticated && user && !user.username) {
            router.replace("/onboarding/identity");
        }
    }, [isAuthenticated, user, pathname, router]);

    return <>{children}</>;
}
