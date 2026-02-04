"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import { Share, Wallet3 } from "iconsax-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { useUserStore } from "@/store/useUserStore";
import toast from "@/lib/toast";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "@/api/auth";

const AuthForm = ({ mode }: { mode: "login" | "signup" }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const handleSocialAuth = (provider: string) => {
    console.log(`Authenticating with ${provider}`);
    window.location.href = "/onboarding/identity";
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";

    try {
      const response = await axiosInstance.post(endpoint, { email, password });
      const { user, token } = response.data.data;

      setUser(user, token);
      toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");

      // Redirect to onboarding
      window.location.href = "/onboarding/identity";
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  const heading = mode === "login" ? "Log In" : "Sign Up";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">EventFi</h1>
        </div>

        {/* Card */}
        <div className="bg-background border-2 border-foreground/10 rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">{heading}</h2>
            <p className="text-foreground/70">
              The all-in-one platform for modern events
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-3 mb-6">
            {/* Google - Primary */}
            {/* Google - Primary */}
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      console.log("Google login success, verifying with backend...");
                      const response = await googleLogin(credentialResponse.credential);
                      const { user, token } = response.data;

                      setUser(user, token);
                      toast.success("Welcome back!");

                      // Check isNewUser flag if needed, but for now redirect to onboarding as per flow
                      // Instructions say: Check isNewUser: If true -> /onboarding, False -> /dashboard
                      if (user.isNewUser) {
                        window.location.href = "/onboarding/identity";
                      } else {
                        window.location.href = "/";
                      }
                    } catch (error: any) {
                      console.error("Backend verification failed:", error);
                      toast.error(error.message || "Google login failed");
                    }
                  }
                }}
                onError={() => {
                  console.log('Login Failed');
                  toast.error("Google login failed");
                }}
                useOneTap
                theme="filled_black"
                shape="pill"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>

            {/* X/Twitter */}
            {/* <Button
              variant="outline"
              size="lg"
              fullWidth
              leftIcon={Share}
              onClick={() => handleSocialAuth("twitter")}
            >
              Continue with X
            </Button> */}
          </div>

          {/* Email Form Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="w-full text-center text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              Or continue with email
            </button>
          </div>

          {/* Email/Password Form */}
          {showEmailForm && (
            <form onSubmit={handleEmailAuth} className="mb-6 space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!email || !password || isLoading}
                isLoading={isLoading}
              >
                {mode === "login" ? "Log In" : "Sign Up"}
              </Button>
            </form>
          )}
          {mode === "login" && (
            <p className="text-sm text-center text-foreground/70 mt-2">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            </p>
          )}


          {/* Switch between login and signup */}
          <div className="text-center mt-4">
            {mode === "login" ? (
              <p className="text-sm text-foreground/70">
                Don't have an account? <Link href="/auth/signup" className="text-primary hover:underline">Sign up</Link>
              </p>
            ) : (
              <p className="text-sm text-foreground/70">
                Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Log in</Link>
              </p>
            )}
          </div>

          {/* Web3 Teaser */}
          <div className="mb-6 pt-3 mt-3 border-t border-foreground/10">
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full border-2 border-foreground/10 text-foreground/30 cursor-not-allowed opacity-50 relative group"
              title="Coming soon to Beta"
            >
              <Wallet3 size={20} color="currentColor" variant="Outline" />
              <span>Connect Wallet</span>
              <span className="text-xs">🔒</span>
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export const LoginForm = () => <AuthForm mode="login" />;
export const SignupForm = () => <AuthForm mode="signup" />;
export default AuthForm;

