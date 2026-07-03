"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CaretLeft, UploadSimple, X, UsersThree } from '@phosphor-icons/react';
import Button from "@/components/Button";
import { CommunityService } from "@/services/community";
import { CommunityVisibility } from "@/types/community";
import customToast from "@/lib/toast";

const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload image");

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};

const CreateCommunityPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null as string | null,
    bannerImage: null as string | null,
    visibility: CommunityVisibility.PUBLIC,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "bannerImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);

    const setUploading = field === "logo" ? setUploadingLogo : setUploadingBanner;
    setUploading(true);
    const uploadedUrl = await uploadImage(file);
    setUploading(false);

    if (uploadedUrl) {
      setFormData((prev) => ({ ...prev, [field]: uploadedUrl }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: null }));
      customToast.error("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      customToast.error("Community name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const community = await CommunityService.create({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        logo: formData.logo || undefined,
        bannerImage: formData.bannerImage || undefined,
        visibility: formData.visibility,
      });
      customToast.success("Community created successfully!");
      router.push(`/communities/${community.id}/manage`);
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to create community");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6"
          >
            <CaretLeft size={20} color="currentColor" weight="regular" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UsersThree size={22} color="currentColor" weight="bold" className="text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create a Community</h1>
          </div>
          <p className="text-foreground/60 mb-8">
            Bring your audience together under one roof. Add chapters and invite leads once it&apos;s created.
          </p>

          <div className="space-y-6">
            {/* Banner upload */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Banner Image</label>
              <div className="relative w-full h-40 rounded-2xl bg-foreground/5 border border-dashed border-foreground/20 overflow-hidden flex items-center justify-center">
                {formData.bannerImage ? (
                  <>
                    <Image src={formData.bannerImage} alt="Banner preview" fill className="object-cover" />
                    <button
                      onClick={() => setFormData((prev) => ({ ...prev, bannerImage: null }))}
                      className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <X size={16} color="currentColor" weight="bold" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer text-foreground/50 hover:text-foreground/70 transition-colors">
                    <UploadSimple size={28} color="currentColor" weight="regular" />
                    <span className="text-sm">{uploadingBanner ? "Uploading..." : "Upload banner image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingBanner}
                      onChange={(e) => handleImageUpload(e, "bannerImage")}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Logo upload */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Logo</label>
              <div className="relative w-24 h-24 rounded-2xl bg-foreground/5 border border-dashed border-foreground/20 overflow-hidden flex items-center justify-center">
                {formData.logo ? (
                  <>
                    <Image src={formData.logo} alt="Logo preview" fill className="object-cover" />
                    <button
                      onClick={() => setFormData((prev) => ({ ...prev, logo: null }))}
                      className="absolute top-1 right-1 p-1 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <X size={14} color="currentColor" weight="bold" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center gap-1 cursor-pointer text-foreground/50 hover:text-foreground/70 transition-colors">
                    <UploadSimple size={20} color="currentColor" weight="regular" />
                    <span className="text-xs">{uploadingLogo ? "..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingLogo}
                      onChange={(e) => handleImageUpload(e, "logo")}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Community Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Founders Friday Nigeria"
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What is this community about?"
                rows={4}
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Visibility</label>
              <div className="flex gap-3">
                {[CommunityVisibility.PUBLIC, CommunityVisibility.PRIVATE].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, visibility: option }))}
                    className={`flex-1 px-4 py-3 rounded-xl border font-semibold text-sm transition-all duration-200 ${
                      formData.visibility === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-foreground/20 text-foreground/60 hover:border-foreground/30"
                    }`}
                  >
                    {option === CommunityVisibility.PUBLIC ? "Public" : "Private"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                Private communities won&apos;t appear in the public directory, but anyone with the link can still view and follow them.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={uploadingLogo || uploadingBanner}
              >
                Create Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPage;
