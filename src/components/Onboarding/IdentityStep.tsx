"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { User, ArrowRight2 } from "iconsax-react";
import axios from "axios";
import axiosInstance from "@/lib/axios";
import toast from "@/lib/toast";

const IdentityStep = () => {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [hasCustomPhoto, setHasCustomPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Generate a DiceBear default avatar on mount
  useEffect(() => {
    const seed = Math.random().toString(36).substring(2, 10);
    const dicebearUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
    setProfilePhoto(dicebearUrl);
  }, []);

  const handleContinue = async () => {
    if (displayName && username) {
      setLoading(true);
      try {
        await axiosInstance.patch("/auth/profile", {
          displayName,
          username,
          avatar: profilePhoto,
        });

        toast.success("Profile updated successfully");
        window.location.href = "/";
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to update profile");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        setHasCustomPhoto(true);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary via backend
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setProfilePhoto(res.data.url);
        setHasCustomPhoto(true);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Upload failed", error);
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
      }
    }
  };

  const isFormValid = displayName.trim() !== "" && username.trim() !== "" && !uploading;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">


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
              <label className={`relative w-32 h-32 rounded-full bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
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
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && <p className="text-xs text-center mt-2 text-primary">Uploading image...</p>}
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
            disabled={!isFormValid || loading}
            onClick={handleContinue}
            isLoading={loading}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdentityStep;

