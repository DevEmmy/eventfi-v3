"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function SessionInit({ children }: { children: React.ReactNode }) {
    const { fetchUser } = useUserStore();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return <>{children}</>;
}
