"use client";
import React, { useState } from "react";
import Button from "@/components/Button";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Forgot password for", email);
        // TODO: integrate with Supabase password reset flow
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-full"
                />
                <Button type="submit" variant="primary" fullWidth>
                    Send Reset Link
                </Button>
            </form>
        </div>
    );
}
