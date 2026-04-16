"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash, PencilSimple, User, Link, Globe, XCircle, Camera } from '@phosphor-icons/react';
import { EventSpeaker } from "@/services/events";

// Categories that logically have speakers
export const SPEAKER_CATEGORIES = [
  "Conference", "Workshop", "Hackathon", "Networking", "Exhibition",
];

export const hasSpeakers = (category: string) => SPEAKER_CATEGORIES.includes(category);

interface SpeakerFormData {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  twitterUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
}

const EMPTY_FORM: SpeakerFormData = {
  name: "", title: "", bio: "", avatar: "",
  twitterUrl: "", linkedinUrl: "", websiteUrl: "",
};

interface SpeakerManagerProps {
  /** Speakers already saved (for manage/edit mode with IDs) */
  speakers: EventSpeaker[];
  /** Called when user adds a new speaker */
  onAdd: (data: SpeakerFormData) => Promise<void> | void;
  /** Called when user edits an existing speaker */
  onUpdate: (id: string, data: Partial<SpeakerFormData>) => Promise<void> | void;
  /** Called when user removes a speaker */
  onRemove: (id: string) => Promise<void> | void;
  /** When true the component manages its own local list (create-event mode) */
  localMode?: boolean;
}

const SpeakerCard: React.FC<{
  speaker: EventSpeaker;
  onEdit: () => void;
  onRemove: () => void;
}> = ({ speaker, onEdit, onRemove }) => (
  <div className="flex items-start gap-4 p-4 bg-foreground/5 border border-foreground/10 rounded-2xl">
    {speaker.avatar ? (
      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-foreground/10">
        <Image src={speaker.avatar} alt={speaker.name} fill className="object-cover" />
      </div>
    ) : (
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/20">
        <User size={24} color="currentColor" weight="fill" className="text-primary" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-foreground">{speaker.name}</p>
      {speaker.title && <p className="text-sm text-foreground/60">{speaker.title}</p>}
      {speaker.bio && <p className="text-xs text-foreground/50 mt-1 line-clamp-2">{speaker.bio}</p>}
      <div className="flex items-center gap-3 mt-2">
        {speaker.twitterUrl && (
          <a href={speaker.twitterUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-primary hover:underline">𝕏</a>
        )}
        {speaker.linkedinUrl && (
          <a href={speaker.linkedinUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-primary hover:underline">in</a>
        )}
        {speaker.websiteUrl && (
          <a href={speaker.websiteUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-primary hover:underline">
            <Globe size={12} color="currentColor" weight="regular" className="inline" />
          </a>
        )}
      </div>
    </div>
    <div className="flex flex-col gap-2 shrink-0">
      <button onClick={onEdit}
        className="p-2 hover:bg-foreground/10 rounded-xl transition-colors text-foreground/60 hover:text-primary">
        <PencilSimple size={16} color="currentColor" weight="regular" />
      </button>
      <button onClick={onRemove}
        className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-foreground/60 hover:text-red-500">
        <Trash size={16} color="currentColor" weight="regular" />
      </button>
    </div>
  </div>
);

const SpeakerFormModal: React.FC<{
  initial?: SpeakerFormData;
  onSave: (data: SpeakerFormData) => Promise<void>;
  onClose: () => void;
}> = ({ initial = EMPTY_FORM, onSave, onClose }) => {
  const [form, setForm] = useState<SpeakerFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof SpeakerFormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      set("avatar", json.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg border border-foreground/10 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background flex items-center justify-between p-6 pb-4 border-b border-foreground/10 z-10">
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            {initial.name ? "Edit Speaker" : "Add Speaker"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-xl transition-colors">
            <XCircle size={22} color="currentColor" weight="regular" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {form.avatar ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30">
                  <Image src={form.avatar} alt="preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center">
                  <User size={32} color="currentColor" weight="regular" className="text-foreground/30" />
                </div>
              )}
              {form.avatar && (
                <button
                  type="button"
                  onClick={() => set("avatar", "")}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <XCircle size={14} color="white" weight="fill" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-foreground/20 text-sm font-medium text-foreground/70 hover:bg-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Camera size={16} color="currentColor" weight="regular" />
              {uploading ? "Uploading…" : form.avatar ? "Change Photo" : "Upload Photo"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Full Name <span className="text-primary">*</span>
            </label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="e.g. Amaka Obi"
              className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Title / Role</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. CTO at Paystack"
              className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={e => set("bio", e.target.value)}
              placeholder="Short bio about the speaker…"
              rows={3}
              className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
          </div>

          <div className="pt-2 border-t border-foreground/10">
            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-3">Social Links (optional)</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-foreground/50 w-6">𝕏</span>
                <input value={form.twitterUrl} onChange={e => set("twitterUrl", e.target.value)}
                  placeholder="https://x.com/handle"
                  className="flex-1 px-4 py-2.5 bg-background border border-foreground/20 rounded-xl text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-foreground/50 w-6">in</span>
                <input value={form.linkedinUrl} onChange={e => set("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/handle"
                  className="flex-1 px-4 py-2.5 bg-background border border-foreground/20 rounded-xl text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div className="flex items-center gap-3">
                <Link size={16} color="currentColor" weight="regular" className="text-foreground/50 w-6" />
                <input value={form.websiteUrl} onChange={e => set("websiteUrl", e.target.value)}
                  placeholder="https://speaker.com"
                  className="flex-1 px-4 py-2.5 bg-background border border-foreground/20 rounded-xl text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background border-t border-foreground/10 p-6 pt-4 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-foreground/20 text-foreground/70 font-semibold hover:bg-foreground/5 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || uploading || !form.name.trim()}
            className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {saving ? "Saving…" : uploading ? "Uploading…" : "Save Speaker"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SpeakerManager: React.FC<SpeakerManagerProps> = ({
  speakers, onAdd, onUpdate, onRemove,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<EventSpeaker | null>(null);

  const handleAdd = async (data: SpeakerFormData) => {
    await onAdd(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: SpeakerFormData) => {
    if (!editTarget) return;
    await onUpdate(editTarget.id, data);
    setEditTarget(null);
  };

  return (
    <div>
      <div className="space-y-3 mb-4">
        {speakers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 rounded-2xl border-2 border-dashed border-foreground/15 text-center">
            <User size={32} color="currentColor" weight="regular" className="text-foreground/30 mb-2" />
            <p className="text-sm text-foreground/50">No speakers added yet</p>
            <p className="text-xs text-foreground/35">Add speakers to help attendees know who to expect</p>
          </div>
        )}
        {speakers.map(s => (
          <SpeakerCard
            key={s.id}
            speaker={s}
            onEdit={() => setEditTarget(s)}
            onRemove={() => onRemove(s.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 w-full justify-center py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
      >
        <Plus size={18} color="currentColor" weight="regular" />
        Add Speaker
      </button>

      {showForm && (
        <SpeakerFormModal
          onSave={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      {editTarget && (
        <SpeakerFormModal
          initial={{
            name: editTarget.name,
            title: editTarget.title || "",
            bio: editTarget.bio || "",
            avatar: editTarget.avatar || "",
            twitterUrl: editTarget.twitterUrl || "",
            linkedinUrl: editTarget.linkedinUrl || "",
            websiteUrl: editTarget.websiteUrl || "",
          }}
          onSave={handleUpdate}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
};

export default SpeakerManager;
