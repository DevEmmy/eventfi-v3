"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
  ArrowLeft2,
  User,
  Location,
  TickCircle,
  Trash,
  Edit2,
} from "iconsax-react";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { UserService } from "@/services/user";
import customToast from "@/lib/toast";

const EditProfilePage = () => {
  const router = useRouter();
  const { user, fetchUser, updateUser } = useUserStore();

  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
    location: "",
    avatar: null as string | null,
    website: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [saveError, setSaveError] = useState("");

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        username: user.username || "",
        bio: user.bio || "",
        location: user.location || "",
        avatar: user.avatar || null,
        website: user.website || "",
      });
    } else {
      // Fetch user if not loaded
      fetchUser();
    }
  }, [user, fetchUser]);

  const locations = [
    "Lagos, Nigeria",
    "Abuja, Nigeria",
    "Port Harcourt, Nigeria",
    "Ibadan, Nigeria",
    "Kano, Nigeria",
    "Enugu, Nigeria",
    "Kaduna, Nigeria",
    "Benin City, Nigeria",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveError("");

    // Validate username
    if (name === "username") {
      const usernameRegex = /^[a-z0-9_-]+$/i;
      if (value && !usernameRegex.test(value)) {
        setUsernameError("Username can only contain letters, numbers, underscores and hyphens");
      } else if (value.length < 3) {
        setUsernameError("Username must be at least 3 characters");
      } else if (value.length > 30) {
        setUsernameError("Username must be less than 30 characters");
      } else {
        setUsernameError("");
      }
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: null }));
  };

  const isFormValid = () => {
    return (
      formData.displayName.trim() !== "" &&
      formData.username.trim() !== "" &&
      usernameError === ""
    );
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      const updatedProfile = await UserService.updateProfile({
        displayName: formData.displayName,
        username: formData.username,
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        avatar: formData.avatar || undefined,
        website: formData.website || undefined,
      });

      // Show success toast
      customToast.success("Profile updated successfully!");

      // Update local store with new data
      updateUser({
        displayName: updatedProfile.displayName,
        username: updatedProfile.username,
        bio: updatedProfile.bio,
        location: updatedProfile.location,
        avatar: updatedProfile.avatar,
        website: updatedProfile.website,
      });


    
      // Redirect back to profile
      router.push("/profile");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
      setSaveError(errorMessage);
      customToast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading if user not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
              <span>Back to Profile</span>
            </button>
            <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
              Edit Profile
            </h1>
            <p className="text-foreground/60">
              Update your personal information and profile settings
            </p>
          </div>

          {/* Error Message */}
          {saveError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
              {saveError}
            </div>
          )}

          {/* Form */}
          <div className="bg-background border border-foreground/10 rounded-2xl p-6 lg:p-8 space-y-8">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4">
                Profile Photo
              </label>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-foreground/10 flex items-center justify-center border-4 border-background overflow-hidden">
                    {formData.avatar ? (
                      <Image
                        src={formData.avatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User
                        size={48}
                        color="currentColor"
                        variant="Bold"
                        className="text-foreground/40"
                      />
                    )}
                  </div>
                  {formData.avatar && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="absolute -top-2 -right-2 p-2 bg-background/90 backdrop-blur-sm rounded-full text-foreground/60 hover:text-primary transition-colors shadow-lg"
                    >
                      <Trash size={16} color="currentColor" variant="Outline" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-foreground/20 rounded-xl cursor-pointer hover:border-primary transition-all duration-200">
                      <Edit2 size={18} color="currentColor" variant="Outline" />
                      <span className="text-sm font-medium text-foreground">
                        {formData.avatar ? "Change Photo" : "Upload Photo"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-foreground/60 mt-2">
                    Recommended: Square image, at least 400x400px. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="e.g., Alex Johnson"
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Username <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-z0-9_-]/gi, "").toLowerCase();
                    handleInputChange({
                      ...e,
                      target: { ...e.target, value },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  placeholder="alexjohnson"
                  className="w-full pl-8 pr-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  required
                />
              </div>
              {usernameError && (
                <p className="text-sm text-primary mt-2">{usernameError}</p>
              )}
              <p className="text-xs text-foreground/60 mt-2">
                Your profile URL will be: eventfi.com/profile/{formData.username || "username"}
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-foreground/60">
                  Share a bit about yourself, your interests, or what you do
                </p>
                <p className="text-xs text-foreground/60">
                  {formData.bio.length}/500
                </p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Location
              </label>
              <div className="relative">
                <Location
                  size={20}
                  color="currentColor"
                  variant="Outline"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                />
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                >
                  <option value="">Select your location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>

            {/* Verification Badge Info */}
            {user.isVerified && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <TickCircle
                    size={24}
                    color="currentColor"
                    variant="Bold"
                    className="text-primary"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Verified Account</p>
                    <p className="text-sm text-foreground/60">
                      Your account is verified. This status cannot be changed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Roles Info */}
            {user.roles && user.roles.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Roles
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-full text-sm text-foreground capitalize"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-foreground/60 mt-2">
                  Roles are managed through your account settings and event activity
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-8">
            <Button
              variant="outline"
              size="md"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={TickCircle}
              onClick={handleSave}
              disabled={!isFormValid() || isSaving}
              isLoading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;

