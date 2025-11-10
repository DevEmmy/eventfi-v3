"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import { Share, Wallet3 } from "iconsax-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSocialAuth = (provider: string) => {
    // Handle social authentication
    console.log(`Authenticating with ${provider}`);
    // After successful auth, redirect to onboarding step 1
    window.location.href = "/onboarding/identity";
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email/password authentication
    console.log("Email auth:", { email, password });
    // After successful auth, redirect to onboarding step 1
    window.location.href = "/onboarding/identity";
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
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
              Welcome to EventFi
            </h2>
            <p className="text-foreground/70">
              The all-in-one platform for modern events
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-3 mb-6">
            {/* Google - Primary */}
            <button
              onClick={() => handleSocialAuth("google")}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-foreground border-2 border-foreground/20 rounded-full font-medium hover:bg-foreground/5 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* X/Twitter */}
            <Button
              variant="outline"
              size="lg"
              fullWidth
              leftIcon={Share}
              onClick={() => handleSocialAuth("twitter")}
            >
              Continue with X
            </Button>
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
                disabled={!email || !password}
              >
                {isLogin ? "Log In" : "Sign Up"}
              </Button>
            </form>
          )}

          {/* Web3 Teaser */}
          <div className="mb-6 pt-6 border-t border-foreground/10">
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

          {/* Footer Switch */}
          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

