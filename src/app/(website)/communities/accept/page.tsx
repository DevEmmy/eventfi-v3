"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CommunityService } from "@/services/community";

function AcceptCommunityInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [communityId, setCommunityId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid invitation link. No token found.");
      return;
    }

    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!storedToken) {
      const returnUrl = encodeURIComponent(`/communities/accept?token=${token}`);
      router.replace(`/auth/login?redirect=${returnUrl}`);
      return;
    }

    CommunityService.acceptInvite(token)
      .then((data) => {
        setStatus("success");
        setMessage(data?.message || "You've successfully joined the community!");
        setCommunityId(data?.communityId || null);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "This invitation is invalid or has already been used."
        );
      });
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-foreground/10 bg-card">
        {status === "loading" && (
          <>
            <div className="mx-auto w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-foreground/60">Accepting your invitation…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Invitation Accepted!
            </h1>
            <p className="text-foreground/60">{message}</p>
            <div className="flex flex-col gap-3 pt-2">
              {communityId && (
                <button
                  onClick={() => router.push(`/communities/${communityId}/manage`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Go to Community
                </button>
              )}
              <button
                onClick={() => router.push("/")}
                className="w-full py-2.5 px-4 rounded-xl border border-foreground/10 text-foreground/70 hover:bg-foreground/5 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Invitation Failed
            </h1>
            <p className="text-foreground/60">{message}</p>
            <button
              onClick={() => router.push("/")}
              className="w-full py-2.5 px-4 rounded-xl border border-foreground/10 text-foreground/70 hover:bg-foreground/5 transition-colors"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AcceptCommunityInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      }
    >
      <AcceptCommunityInvitationContent />
    </Suspense>
  );
}
