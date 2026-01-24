"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button";

export default function ResetPasswordPage() {
    const search = useSearchParams();
    const token = search.get("token");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Reset password with token", token, password);
        // TODO: integrate with Supabase reset password API
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
                <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-full"
                />
                <Button type="submit" variant="primary" fullWidth>
                    Reset Password
                </Button>
            </form>
        </div>
    );
}
