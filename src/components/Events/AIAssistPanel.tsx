"use client";

import React, { useRef, useState } from "react";
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

type InputTab = "text" | "image" | "document";

interface AIAssistPanelProps {
  onGenerated: (result: AIEventResult) => void;
}

const EXAMPLES = [
  { label: "Tech Night", text: "Tech startup networking event on April 15th at The Hub Victoria Island Lagos, 6pm–9pm. Free entry. Panel discussion, pitches, drinks." },
  { label: "Charity Gala", text: "Annual charity gala dinner on May 3rd at Eko Hotel Lagos. Black tie optional. Tickets ₦50,000 VIP, ₦25,000 regular. Fundraising for children's education." },
  { label: "Yoga Retreat", text: "Weekend yoga & wellness retreat at Landmark Beach Lagos, next Saturday 7am–12pm. ₦5,000 per person. Bring your mat." },
];

const ACCEPTED_IMAGES = "image/jpeg,image/jpg,image/png,image/webp,image/gif";
const ACCEPTED_DOCS = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,.pdf,.docx,.doc";

export const AIAssistPanel: React.FC<AIAssistPanelProps> = ({ onGenerated }) => {
  const [tab, setTab] = useState<InputTab>("text");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [extraContext, setExtraContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 2000) {
      setDescription(e.target.value);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError(null);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setFilePreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    setExtraContext("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canGenerate = () => {
    if (loading) return false;
    if (tab === "text") return description.trim().length >= 10;
    return file !== null;
  };

  const handleGenerate = async () => {
    if (!canGenerate()) return;
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      if (tab === "text") {
        formData.append("description", description.trim());
      } else {
        formData.append("file", file!);
        if (extraContext.trim()) {
          formData.append("description", extraContext.trim());
        }
      }

      const res = await axiosInstance.post("/ai/generate-event", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onGenerated(res.data.data as AIEventResult);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-linear-to-br from-primary/5 via-background to-background mb-8">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">AI Event Assistant</h2>
            <p className="text-sm text-foreground/55 mt-0.5">
              Describe, upload a flyer, or attach a document — AI will fill everything in for you.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-foreground/5 rounded-xl mb-5 w-fit">
          {([
            { id: "text", icon: <PenIcon />, label: "Describe" },
            { id: "image", icon: <ImageIcon />, label: "Flyer / Image" },
            { id: "document", icon: <DocIcon />, label: "Document" },
          ] as { id: InputTab; icon: React.ReactNode; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                tab === t.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Text tab ── */}
        {tab === "text" && (
          <div>
            <div className="relative">
              <textarea
                value={description}
                onChange={handleDescChange}
                placeholder="e.g. I'm hosting a tech networking night in Lagos on April 20th at The Civic Centre, 6pm to 9pm. Free entry, limited to 200 people. There will be guest speakers, demos, and drinks..."
                rows={5}
                disabled={loading}
                className="w-full px-4 py-3.5 bg-background/80 border border-foreground/15 rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none text-sm leading-relaxed"
              />
              <span className="absolute bottom-3 right-3 text-xs text-foreground/30">
                {description.length}/2000
              </span>
            </div>

            {/* Example prompts */}
            <div className="mt-3">
              <p className="text-xs font-medium text-foreground/35 mb-2 uppercase tracking-wide">
                Try an example
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => { setDescription(ex.text); setError(null); }}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-full border border-foreground/10 text-foreground/50 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-150 disabled:opacity-40"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Image tab ── */}
        {tab === "image" && (
          <div className="space-y-4">
            {!file ? (
              <label className="block cursor-pointer">
                <div className="w-full border-2 border-dashed border-foreground/15 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/3 transition-all duration-200">
                  <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-foreground/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground/70">Upload event flyer or poster</p>
                    <p className="text-xs text-foreground/35 mt-1">JPG, PNG, WebP or GIF up to 10 MB</p>
                  </div>
                  <span className="text-xs px-4 py-2 rounded-full border border-foreground/15 text-foreground/50 hover:border-primary/40 hover:text-primary transition-colors">
                    Choose file
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGES}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                {filePreview && (
                  <img
                    src={filePreview}
                    alt="Event flyer preview"
                    className="w-full max-h-64 object-contain rounded-xl border border-foreground/10 bg-foreground/3"
                  />
                )}
                <div className="mt-3 flex items-center justify-between px-3 py-2.5 bg-foreground/5 rounded-xl border border-foreground/10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ImageIcon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground/70 truncate">{file.name}</span>
                    <span className="text-xs text-foreground/35 shrink-0">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                  <button onClick={clearFile} className="ml-3 p-1 text-foreground/40 hover:text-primary transition-colors shrink-0">
                    <XIcon />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground/40 mb-1.5">
                Additional context <span className="text-foreground/25">(optional)</span>
              </label>
              <input
                type="text"
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                placeholder="e.g. Tickets are ₦5,000 — not shown on flyer"
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-background/80 border border-foreground/15 rounded-xl text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* ── Document tab ── */}
        {tab === "document" && (
          <div className="space-y-4">
            {!file ? (
              <label className="block cursor-pointer">
                <div className="w-full border-2 border-dashed border-foreground/15 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/3 transition-all duration-200">
                  <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                    <DocIcon className="w-6 h-6 text-foreground/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground/70">Upload event document</p>
                    <p className="text-xs text-foreground/35 mt-1">PDF or Word document (.docx / .doc) up to 10 MB</p>
                  </div>
                  <span className="text-xs px-4 py-2 rounded-full border border-foreground/15 text-foreground/50 hover:border-primary/40 hover:text-primary transition-colors">
                    Choose file
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_DOCS}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div>
                <div className="flex items-center gap-3 px-4 py-3.5 bg-foreground/5 rounded-xl border border-foreground/10">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <DocIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-foreground/40">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <button onClick={clearFile} className="p-1 text-foreground/40 hover:text-primary transition-colors shrink-0">
                    <XIcon />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground/40 mb-1.5">
                Additional context <span className="text-foreground/25">(optional)</span>
              </label>
              <input
                type="text"
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                placeholder="e.g. This is for the Lagos chapter"
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-background/80 border border-foreground/15 rounded-xl text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
            <span>⚠</span> {error}
          </p>
        )}

        {/* Generate button */}
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate()}
            className="relative flex items-center gap-2.5 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden group"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analysing…</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                <span>Generate with AI</span>
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
              </>
            )}
          </button>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-foreground/45">
              <LoadingDots />
              <span>
                {tab === "image" ? "Reading your flyer…" : tab === "document" ? "Parsing document…" : "Analysing your event…"}
              </span>
            </div>
          )}
        </div>

        {/* Shimmer while loading */}
        {loading && (
          <div className="mt-5 space-y-2.5 animate-pulse">
            {[75, 55, 85, 45, 65].map((w, i) => (
              <div key={i} className="h-2.5 bg-foreground/8 rounded-full" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Inline SVG icons ────────────────────────────────────────────────────────

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.88 5.76L20 10l-6.12 1.24L12 17l-1.88-5.76L4 10l6.12-1.24L12 3z" />
    <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="4" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const PenIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? "w-3.5 h-3.5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? "w-3.5 h-3.5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const DocIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? "w-3.5 h-3.5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LoadingDots = () => (
  <span className="flex gap-0.5">
    {[0, 1, 2].map((i) => (
      <span key={i} className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
    ))}
  </span>
);

export default AIAssistPanel;
