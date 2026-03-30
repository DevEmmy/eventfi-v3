"use client";

import React, { useState } from "react";
import axiosInstance from "@/lib/axios";

export interface AIEventResult {
  title: string;
  description: string;
  category: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isOnline: boolean;
  venue: string;
  location: string;
  onlineLink: string;
  visibility: "public" | "private";
  tickets: Array<{
    name: string;
    price: string;
    quantity: number;
    description: string;
  }>;
  agenda: Array<{
    time: string;
    activity: string;
    description: string;
  }>;
  tags: string[];
}

interface AIAssistPanelProps {
  onGenerated: (result: AIEventResult) => void;
}

const EXAMPLES = [
  "Tech startup networking event on April 15th at The Hub Victoria Island Lagos, 6pm–9pm. Free entry. Panel discussion, pitches, drinks.",
  "Annual charity gala dinner on May 3rd at Eko Hotel Lagos. Black tie optional. Tickets ₦50,000 VIP, ₦25,000 regular. Fundraising for children's education.",
  "Weekend yoga & wellness retreat at Landmark Beach Lagos, next Saturday 7am–12pm. ₦5,000 per person. Bring your mat.",
];

export const AIAssistPanel: React.FC<AIAssistPanelProps> = ({ onGenerated }) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 2000) {
      setDescription(val);
      setCharCount(val.length);
    }
  };

  const handleGenerate = async () => {
    if (description.trim().length < 10) {
      setError("Please describe your event in at least a few words.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await axiosInstance.post("/ai/generate-event", { description });
      onGenerated(res.data.data as AIEventResult);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (example: string) => {
    setDescription(example);
    setCharCount(example.length);
    setError(null);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background mb-8">
      {/* Glow effect */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              AI Event Assistant
            </h2>
            <p className="text-sm text-foreground/60 mt-0.5">
              Describe your event in plain language and AI will fill in all the
              details for you.
            </p>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="e.g. I'm hosting a tech networking night in Lagos on April 20th at The Civic Centre, 6pm to 9pm. Free entry, limited to 200 people. There will be guest speakers, demos, and drinks..."
            rows={5}
            className="w-full px-4 py-3.5 bg-background/80 border border-foreground/15 rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none text-sm leading-relaxed"
            disabled={loading}
          />
          <span className="absolute bottom-3 right-3 text-xs text-foreground/30">
            {charCount}/2000
          </span>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
            <span>⚠</span> {error}
          </p>
        )}

        {/* Example prompts */}
        <div className="mt-4">
          <p className="text-xs font-medium text-foreground/40 mb-2 uppercase tracking-wide">
            Try an example
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleExample(ex)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full border border-foreground/10 text-foreground/50 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-150 disabled:opacity-40"
              >
                {["Tech Networking", "Charity Gala", "Wellness Retreat"][i]}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={loading || description.trim().length < 10}
            className="relative flex items-center gap-2.5 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden group"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                <span>Generate with AI</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              </>
            )}
          </button>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-foreground/50">
              <LoadingDots />
              <span>Analysing your event…</span>
            </div>
          )}
        </div>

        {/* Loading overlay shimmer */}
        {loading && (
          <div className="mt-5 space-y-2.5 animate-pulse">
            {[80, 60, 90, 50].map((w, i) => (
              <div
                key={i}
                className="h-3 bg-foreground/8 rounded-full"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Inline icon components ──────────────────────────────────────────────────

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.88 5.76L20 10l-6.12 1.24L12 17l-1.88-5.76L4 10l6.12-1.24L12 3z" />
    <path d="M5 18l.94 2.88L8 22l-2.06.62L5 25" />
    <path d="M19 3l.63 1.88L21.5 5.5l-1.87.62L19 8l-.63-1.88L16.5 5.5l1.87-.62L19 3z" />
  </svg>
);

const LoadingDots = () => (
  <span className="flex gap-0.5">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
      />
    ))}
  </span>
);

export default AIAssistPanel;
