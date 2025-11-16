"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import {
  Setting2,
  User,
  Notification,
  Lock,
  Trash,
  Logout,
  Edit2,
  TickCircle,
} from "iconsax-react";

const SettingsSection = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    eventReminders: true,
    newMessages: true,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public" as "public" | "private" | "friends",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: any) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", { notifications, privacy });
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-background border border-foreground/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User size={24} color="currentColor" variant="Bold" className="text-primary" />
          </div>
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            Account Settings
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div>
              <div className="font-semibold text-foreground mb-1">Edit Profile</div>
              <div className="text-sm text-foreground/60">Update your personal information</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Edit2}
              onClick={() => window.location.href = "/profile/edit"}
            >
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div>
              <div className="font-semibold text-foreground mb-1">Change Password</div>
              <div className="text-sm text-foreground/60">Update your account password</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = "/settings/password"}
            >
              Change
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-background border border-foreground/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Notification size={24} color="currentColor" variant="Bold" className="text-secondary" />
          </div>
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            Notifications
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div className="flex-1">
              <div className="font-semibold text-foreground mb-1">Email Notifications</div>
              <div className="text-sm text-foreground/60">Receive updates via email</div>
            </div>
            <button
              onClick={() => handleNotificationChange("email")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                notifications.email ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  notifications.email ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div className="flex-1">
              <div className="font-semibold text-foreground mb-1">Push Notifications</div>
              <div className="text-sm text-foreground/60">Receive browser push notifications</div>
            </div>
            <button
              onClick={() => handleNotificationChange("push")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                notifications.push ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  notifications.push ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div className="flex-1">
              <div className="font-semibold text-foreground mb-1">SMS Notifications</div>
              <div className="text-sm text-foreground/60">Receive updates via SMS</div>
            </div>
            <button
              onClick={() => handleNotificationChange("sms")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                notifications.sms ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  notifications.sms ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div className="flex-1">
              <div className="font-semibold text-foreground mb-1">Event Reminders</div>
              <div className="text-sm text-foreground/60">Get reminded before events</div>
            </div>
            <button
              onClick={() => handleNotificationChange("eventReminders")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                notifications.eventReminders ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  notifications.eventReminders ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div className="flex-1">
              <div className="font-semibold text-foreground mb-1">New Messages</div>
              <div className="text-sm text-foreground/60">Notify when you receive messages</div>
            </div>
            <button
              onClick={() => handleNotificationChange("newMessages")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                notifications.newMessages ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  notifications.newMessages ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div className="flex-1">
              <div className="font-semibold text-foreground mb-1">Marketing Emails</div>
              <div className="text-sm text-foreground/60">Receive promotional emails and updates</div>
            </div>
            <button
              onClick={() => handleNotificationChange("marketing")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                notifications.marketing ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  notifications.marketing ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-background border border-foreground/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Lock size={24} color="currentColor" variant="Bold" className="text-accent" />
          </div>
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            Privacy Settings
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Profile Visibility
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-4 border border-foreground/20 rounded-xl cursor-pointer hover:border-primary transition-all duration-200">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={privacy.profileVisibility === "public"}
                  onChange={() => handlePrivacyChange("profileVisibility", "public")}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-semibold text-foreground">Public</div>
                  <div className="text-sm text-foreground/60">Anyone can view your profile</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-foreground/20 rounded-xl cursor-pointer hover:border-primary transition-all duration-200">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="private"
                  checked={privacy.profileVisibility === "private"}
                  onChange={() => handlePrivacyChange("profileVisibility", "private")}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-semibold text-foreground">Private</div>
                  <div className="text-sm text-foreground/60">Only you can view your profile</div>
                </div>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div className="flex-1">
              <div className="font-semibold text-foreground mb-1">Show Email Address</div>
              <div className="text-sm text-foreground/60">Display your email on your profile</div>
            </div>
            <button
              onClick={() => handlePrivacyChange("showEmail", !privacy.showEmail)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                privacy.showEmail ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  privacy.showEmail ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div className="flex-1">
              <div className="font-semibold text-foreground mb-1">Show Phone Number</div>
              <div className="text-sm text-foreground/60">Display your phone on your profile</div>
            </div>
            <button
              onClick={() => handlePrivacyChange("showPhone", !privacy.showPhone)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                privacy.showPhone ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  privacy.showPhone ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div className="flex-1">
              <div className="font-semibold text-foreground mb-1">Allow Messages</div>
              <div className="text-sm text-foreground/60">Let others send you messages</div>
            </div>
            <button
              onClick={() => handlePrivacyChange("allowMessages", !privacy.allowMessages)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                privacy.allowMessages ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  privacy.allowMessages ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-background border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Trash size={24} color="currentColor" variant="Bold" className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            Danger Zone
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-xl bg-red-500/5">
            <div>
              <div className="font-semibold text-foreground mb-1">Delete Account</div>
              <div className="text-sm text-foreground/60">
                Permanently delete your account and all associated data
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Trash}
              onClick={() => {
                if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  // Handle account deletion
                  console.log("Account deletion requested");
                }
              }}
              className="border-red-500/50 text-red-500 hover:bg-red-500/10"
            >
              Delete
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
            <div>
              <div className="font-semibold text-foreground mb-1">Log Out</div>
              <div className="text-sm text-foreground/60">Sign out of your account</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Logout}
              onClick={() => {
                // Handle logout
                console.log("Logout requested");
                window.location.href = "/auth";
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          leftIcon={TickCircle}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsSection;

