"use client";
import { Suspense } from "react";
import { SignupForm } from "@/components/Auth/AuthPage";

export default function AuthRootPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" /></div>}>
      <SignupForm />
    </Suspense>
  );
}

