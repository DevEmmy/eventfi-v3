"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Link from "next/link";
import { ArrowLeft2, Sms } from "iconsax-react";
import { UserService } from "@/services/user";
import toast from "@/lib/toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await UserService.forgotPassword(email);
            setIsSubmitted(true);
            toast.success("Reset link sent successfully!");
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to send reset link. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

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
                            Forgot Password
                        </h2>
                        <p className="text-foreground/70">
                            Enter your email to receive a password reset link
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/40">
                                    <Sms size={20} color={"#3D5AFE"} variant="Outline" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                isLoading={isLoading}
                                disabled={!email || isLoading}
                            >
                                Send Reset Link
                            </Button>

                            <div className="text-center mt-4">
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
                                >
                                    <ArrowLeft2 color={"#3D5AFE"} size={16} />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                <Sms size={32} color={"#3D5AFE"} variant="Bold" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-foreground">Check your email</h3>
                                <p className="text-foreground/70">
                                    We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="lg"
                                fullWidth
                                onClick={() => setIsSubmitted(false)}
                            >
                                Resend Email
                            </Button>
                            <div className="text-center mt-4">
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
                                >
                                    <ArrowLeft2 color={"#3D5AFE"} size={16} />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
