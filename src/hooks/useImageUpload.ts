"use client";

import { useCallback, useState } from "react";
import customToast from "@/lib/toast";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — matches /api/upload
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

/**
 * Uploads a File straight to Cloudinary via /api/upload and returns the secure URL.
 * This is the ONLY sanctioned way to turn a File into a persistable image value —
 * never store a FileReader/base64 data URI in form state that gets submitted to the API.
 */
export async function uploadImage(file: File): Promise<string | null> {
    if (!ALLOWED_TYPES.includes(file.type)) {
        customToast.error(`Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF`);
        return null;
    }
    if (file.size > MAX_FILE_SIZE) {
        customToast.error(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        return null;
    }

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", { method: "POST", body: formData });
        if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(body?.error || "Failed to upload image");
        }

        const data = await response.json();
        return data.url as string;
    } catch (error) {
        console.error("Image upload failed:", error);
        customToast.error("Failed to upload image. Please try again.");
        return null;
    }
}

/**
 * Convenience hook: tracks an `uploading` flag around `uploadImage` so callers
 * can disable submit buttons while a file is in flight.
 */
export function useImageUpload() {
    const [uploading, setUploading] = useState(false);

    const upload = useCallback(async (file: File): Promise<string | null> => {
        setUploading(true);
        try {
            return await uploadImage(file);
        } finally {
            setUploading(false);
        }
    }, []);

    return { upload, uploading };
}
