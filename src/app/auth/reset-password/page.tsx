"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import { Lock, Eye, EyeSlash } from "iconsax-react";
import { UserService } from "@/services/user";
import toast from "@/lib/toast";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            await UserService.resetPassword(token, password);
            toast.success("Password reset successfully!");
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (error: any) {
            const message = error.response?.data?.message || "Invalid or expired reset token.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center p-8 bg-red-500/10 rounded-2xl border-2 border-red-500/20">
                <h3 className="text-xl font-bold text-red-500 mb-2">Invalid Reset Link</h3>
                <p className="text-foreground/70 mb-6">
                    The password reset link is invalid or has expired. Please request a new one.
                </p>
                <Button variant="outline" fullWidth onClick={() => router.push("/auth/forgot-password")}>
                    Request New Link
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/40">
                        <Lock size={20} variant="Outline" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                        required
                        className="w-full pl-11 pr-12 py-3 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-foreground/40 hover:text-foreground transition-colors"
                    >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/40">
                        <Lock size={20} variant="Outline" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="w-full pl-11 pr-12 py-3 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                </div>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={!password || !confirmPassword || isLoading}
            >
                Reset Password
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">EventFi</h1>
                </div>

                {/* Card */}
                <div className="bg-background border-2 border-foreground/10 rounded-2xl p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
                            Reset Password
                        </h2>
                        <p className="text-foreground/70">
                            Create a new secure password for your account
                        </p>
                    </div>

                    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
