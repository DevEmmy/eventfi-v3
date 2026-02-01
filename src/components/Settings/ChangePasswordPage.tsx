"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
  ArrowLeft2,
  Lock,
  Eye,
  EyeSlash,
  TickCircle,
  Warning2,
} from "iconsax-react";
import { SettingsService } from "@/services/settings";
import customToast from "@/lib/toast";

const ChangePasswordPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      return { strength: 1, label: "Weak", color: "text-red-500" };
    } else if (strength <= 4) {
      return { strength: 2, label: "Medium", color: "text-yellow-500" };
    } else {
      return { strength: 3, label: "Strong", color: "text-green-500" };
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  // Password requirements checker
  const passwordRequirements = {
    minLength: formData.newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.newPassword),
    hasLowerCase: /[a-z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
    hasSpecialChar: /[^a-zA-Z0-9]/.test(formData.newPassword),
  };

  const allRequirementsMet =
    passwordRequirements.minLength &&
    passwordRequirements.hasUpperCase &&
    passwordRequirements.hasLowerCase &&
    passwordRequirements.hasNumber &&
    passwordRequirements.hasSpecialChar;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Validate new password
    if (name === "newPassword") {
      if (value.length > 0 && value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          newPassword: "Password must be at least 8 characters",
        }));
      }
    }

    // Validate confirm password
    if (name === "confirmPassword") {
      if (value !== formData.newPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      }
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!allRequirementsMet) {
      newErrors.newPassword = "Password does not meet all requirements";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      await SettingsService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(true);
      customToast.success("Password changed successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to change password:", error);
      const errorMessage = error.response?.data?.message || "Failed to change password. Please check your current password.";

      if (error.response?.status === 401) {
        setErrors((prev) => ({ ...prev, currentPassword: "Current password is incorrect" }));
      } else {
        customToast.error(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TickCircle
                size={32}
                color="currentColor"
                variant="Bold"
                className="text-green-500"
              />
            </div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
              Password Changed Successfully
            </h2>
            <p className="text-foreground/60 mb-6">
              Your password has been updated. Redirecting to your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
              <span>Back to Settings</span>
            </button>
            <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
              Change Password
            </h1>
            <p className="text-foreground/60">
              Update your account password to keep your account secure
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-background border border-foreground/10 rounded-2xl p-6 lg:p-8 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Current Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    color="currentColor"
                    variant="Outline"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                  />
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your current password"
                    className={`w-full pl-12 pr-12 py-3 bg-background border ${errors.currentPassword
                        ? "border-red-500"
                        : "border-foreground/20"
                      } rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                  >
                    {showPasswords.current ? (
                      <EyeSlash size={20} color="currentColor" variant="Outline" />
                    ) : (
                      <Eye size={20} color="currentColor" variant="Outline" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                    <Warning2 size={16} color="currentColor" variant="Outline" />
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  New Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    color="currentColor"
                    variant="Outline"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                  />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your new password"
                    className={`w-full pl-12 pr-12 py-3 bg-background border ${errors.newPassword
                        ? "border-red-500"
                        : formData.newPassword && allRequirementsMet
                          ? "border-green-500"
                          : "border-foreground/20"
                      } rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                  >
                    {showPasswords.new ? (
                      <EyeSlash size={20} color="currentColor" variant="Outline" />
                    ) : (
                      <Eye size={20} color="currentColor" variant="Outline" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-foreground/60">Password Strength</span>
                      <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.strength === 1
                            ? "bg-red-500 w-1/3"
                            : passwordStrength.strength === 2
                              ? "bg-yellow-500 w-2/3"
                              : "bg-green-500 w-full"
                          }`}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {formData.newPassword && (
                  <div className="mt-4 p-4 bg-foreground/5 rounded-xl border border-foreground/10">
                    <p className="text-xs font-semibold text-foreground mb-2">
                      Password Requirements:
                    </p>
                    <div className="space-y-1.5">
                      {[
                        {
                          met: passwordRequirements.minLength,
                          text: "At least 8 characters",
                        },
                        {
                          met: passwordRequirements.hasUpperCase,
                          text: "One uppercase letter",
                        },
                        {
                          met: passwordRequirements.hasLowerCase,
                          text: "One lowercase letter",
                        },
                        {
                          met: passwordRequirements.hasNumber,
                          text: "One number",
                        },
                        {
                          met: passwordRequirements.hasSpecialChar,
                          text: "One special character",
                        },
                      ].map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {req.met ? (
                            <TickCircle
                              size={16}
                              color="currentColor"
                              variant="Bold"
                              className="text-green-500"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-foreground/20" />
                          )}
                          <span
                            className={`text-xs ${req.met ? "text-foreground/70" : "text-foreground/50"
                              }`}
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.newPassword && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                    <Warning2 size={16} color="currentColor" variant="Outline" />
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Confirm New Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    color="currentColor"
                    variant="Outline"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                  />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your new password"
                    className={`w-full pl-12 pr-12 py-3 bg-background border ${errors.confirmPassword
                        ? "border-red-500"
                        : formData.confirmPassword &&
                          formData.confirmPassword === formData.newPassword
                          ? "border-green-500"
                          : "border-foreground/20"
                      } rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                  >
                    {showPasswords.confirm ? (
                      <EyeSlash size={20} color="currentColor" variant="Outline" />
                    ) : (
                      <Eye size={20} color="currentColor" variant="Outline" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                    <Warning2 size={16} color="currentColor" variant="Outline" />
                    {errors.confirmPassword}
                  </p>
                )}
                {formData.confirmPassword &&
                  formData.confirmPassword === formData.newPassword &&
                  !errors.confirmPassword && (
                    <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                      <TickCircle size={16} color="currentColor" variant="Bold" />
                      Passwords match
                    </p>
                  )}
              </div>

              {/* Security Note */}
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lock
                    size={20}
                    color="currentColor"
                    variant="Bold"
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Security Tips
                    </p>
                    <ul className="text-xs text-foreground/70 space-y-1 list-disc list-inside">
                      <li>Use a unique password that you don't use elsewhere</li>
                      <li>Don't share your password with anyone</li>
                      <li>Consider using a password manager</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-8">
              <Button
                variant="outline"
                size="md"
                onClick={() => router.back()}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={Lock}
                onClick={handleSubmit}
                disabled={isSaving || !allRequirementsMet}
                isLoading={isSaving}
                type="submit"
              >
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

