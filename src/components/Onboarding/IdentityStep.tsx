"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import { User, ArrowRight2 } from "iconsax-react";
import Image from "next/image";

const IdentityStep = () => {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handleSkip = () => {
    // Use email prefix as username, default avatar
    window.location.href = "/onboarding/role";
  };

  const handleContinue = () => {
    if (displayName && username) {
      // Save profile data
      window.location.href = "/onboarding/role";
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = displayName.trim() !== "" && username.trim() !== "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Skip Button */}
        <div className="text-right mb-8">
          <button
            onClick={handleSkip}
            className="text-sm text-foreground/50 hover:text-foreground/70 transition-colors"
          >
            Skip for now &gt;
          </button>
        </div>

        {/* Card */}
        <div className="bg-background border-2 border-foreground/10 rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
              Let's get you set up
            </h2>
            <p className="text-foreground/70">
              How should we identify you on EventFi?
            </p>
          </div>

          {/* Profile Photo */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-3 text-center">
              Profile Photo
            </label>
            <div className="flex justify-center">
              <label className="relative w-32 h-32 rounded-full bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors group">
                {profilePhoto ? (
                  <Image
                    src={profilePhoto}
                    alt="Profile"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <User
                    size={48}
                    color="currentColor"
                    variant="Outline"
                    className="text-foreground/40 group-hover:text-primary"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Display Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Carter"
              className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Username */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-z0-9_]/gi, "");
                setUsername(value);
              }}
              placeholder="@alexcarter"
              className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
            <p className="text-xs text-foreground/60 mt-2 ml-4">
              Unique handle for your profile URL
            </p>
          </div>

          {/* Continue Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={ArrowRight2}
            disabled={!isFormValid}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdentityStep;

