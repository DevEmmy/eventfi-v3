"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Link from "next/link";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token provided.");
            return;
        }

        const verify = async () => {
            try {
                const response = await axiosInstance.post("/auth/verify-email", { token });
                setStatus("success");
                setMessage(response.data.message || "Email verified successfully!");
            } catch (error: any) {
                setStatus("error");
                setMessage(
                    error.response?.data?.message || "Verification failed. The link may have expired."
                );
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">EventFi</h1>
                </div>

                <div className="bg-background border-2 border-foreground/10 rounded-2xl p-8 shadow-xl text-center">
                    {status === "loading" && (
                        <>
                            <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-foreground mb-2">Verifying your email...</h2>
                            <p className="text-foreground/60">Please wait a moment.</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">Email Verified!</h2>
                            <p className="text-foreground/60 mb-6">{message}</p>
                            <Link
                                href="/"
                                className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Continue to EventFi
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">Verification Failed</h2>
                            <p className="text-foreground/60 mb-6">{message}</p>
                            <Link
                                href="/auth/login"
                                className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Go to Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
