"use client";

import React, { useEffect, useState } from "react";
import {
  ActivityService,
  ActivitySummary,
  ActivityDetail,
} from "@/services/activity";
import { Gift, MusicNote, Crown, ArrowLeft, Users, CalendarBlank, Timer } from '@phosphor-icons/react';
import Image from "next/image";

interface GameHistoryPanelProps {
  eventId: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function GameTypeBadge({ type }: { type: string }) {
  if (type === "LUCKY_DRAW") {
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-semibold">
        <Gift size={11} color="currentColor" weight="fill" />
        Lucky Draw
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
      <MusicNote size={11} color="currentColor" weight="fill" />
      Applause Meter
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  if (status === "ENDED")
    return <span className="px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/40 text-xs">Ended</span>;
  if (status === "ACTIVE")
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
        Live
      </span>
    );
  return <span className="px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/40 text-xs">Idle</span>;
}

// ─── Detail View ─────────────────────────────────────────────────────────────

function DetailView({
  eventId,
  activityId,
  onBack,
}: {
  eventId: string;
  activityId: string;
  onBack: () => void;
}) {
  const [detail, setDetail] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ActivityService.getDetail(eventId, activityId)
      .then(setDetail)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventId, activityId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <button onClick={onBack} className="flex items-center gap-2 text-foreground/50 hover:text-foreground text-sm transition-colors cursor-pointer">
          <ArrowLeft size={16} color="currentColor" />
          Back to history
        </button>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-foreground/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="space-y-4">
        <button onClick={onBack} className="flex items-center gap-2 text-foreground/50 hover:text-foreground text-sm transition-colors cursor-pointer">
          <ArrowLeft size={16} color="currentColor" />
          Back to history
        </button>
        <p className="text-sm text-foreground/50 text-center py-8">Failed to load details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-foreground/50 hover:text-foreground text-sm transition-colors cursor-pointer">
        <ArrowLeft size={16} color="currentColor" />
        Back to history
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${detail.type === "LUCKY_DRAW" ? "bg-yellow-500/10" : "bg-primary/10"}`}>
            {detail.type === "LUCKY_DRAW"
              ? <Gift size={20} color="#f59e0b" weight="fill" />
              : <MusicNote size={20} color="currentColor" weight="fill" className="text-primary" />
            }
          </div>
          <div>
            <h4 className="font-bold text-foreground">
              {detail.type === "LUCKY_DRAW" ? "Lucky Draw" : "Applause Meter"}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-foreground/40">
              <CalendarBlank size={11} color="currentColor" />
              {formatDate(detail.createdAt)}
            </div>
          </div>
        </div>
        <StatusDot status={detail.status} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-foreground/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground tabular-nums">
            {detail.participantCount}
          </div>
          <p className="text-xs text-foreground/50 mt-0.5">participants</p>
        </div>
        {detail.type === "APPLAUSE_METER" ? (
          <div className="bg-foreground/5 rounded-xl p-3 text-center">
            <div className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-primary tabular-nums">
              {(detail.totalTaps ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-foreground/50 mt-0.5">total taps</p>
          </div>
        ) : (
          <div className="bg-foreground/5 rounded-xl p-3 text-center">
            <div className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-yellow-500 tabular-nums">
              {detail.winners?.length ?? 0}
            </div>
            <p className="text-xs text-foreground/50 mt-0.5">{(detail.winners?.length ?? 0) === 1 ? "winner" : "winners"}</p>
          </div>
        )}
      </div>

      {/* Lucky Draw — winners */}
      {detail.type === "LUCKY_DRAW" && (detail.winners?.length ?? 0) > 0 && (
        <div className="bg-background border border-yellow-500/20 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-yellow-500/10 flex items-center gap-2">
            <Crown size={14} color="#f59e0b" weight="fill" />
            <span className="text-sm font-semibold text-foreground">
              {(detail.winners?.length ?? 0) === 1 ? "Winner" : "Winners"}
            </span>
            {detail.drawnAt && (
              <span className="text-xs text-foreground/40 ml-auto">
                Drawn {formatDate(detail.drawnAt)}
              </span>
            )}
          </div>
          <ul className="divide-y divide-foreground/5">
            {detail.winners!.map((w, i) => (
              <li key={w.userId} className="flex items-center gap-3 px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-foreground/10 overflow-hidden shrink-0">
                  {w.avatar ? (
                    <Image src={w.avatar} alt={w.name} width={32} height={32} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-foreground/50">
                      {w.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{w.name}</p>
                  {w.username && <p className="text-xs text-foreground/40">@{w.username}</p>}
                </div>
                <Crown size={14} color="#f59e0b" weight="fill" className="shrink-0" />
              </li>
            ))}
          </ul>
          <div className="px-4 py-2 border-t border-foreground/5">
            <p className="text-xs text-foreground/40">
              Drawn from {detail.totalPool ?? detail.participantCount} eligible participants
            </p>
          </div>
        </div>
      )}

      {/* Applause Meter — leaderboard */}
      {detail.type === "APPLAUSE_METER" && (detail.leaderboard?.length ?? 0) > 0 && (
        <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-foreground/5 flex items-center gap-2">
            <Crown size={14} color="#f59e0b" weight="fill" />
            <span className="text-sm font-semibold text-foreground">Final Leaderboard</span>
            <span className="text-xs text-foreground/40 ml-auto">{detail.leaderboard!.length} tappers</span>
          </div>
          <ul className="divide-y divide-foreground/5">
            {detail.leaderboard!.map((entry, i) => (
              <li key={entry.userId} className="flex items-center gap-3 px-4 py-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? "bg-yellow-400 text-white" : i === 1 ? "bg-slate-300 text-slate-700" : i === 2 ? "bg-amber-600 text-white" : "bg-foreground/10 text-foreground/60"
                }`}>
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-foreground/10 overflow-hidden shrink-0">
                  {entry.avatar ? (
                    <Image src={entry.avatar} alt={entry.name} width={32} height={32} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-foreground/50">
                      {entry.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{entry.name}</p>
                  {entry.username && <p className="text-xs text-foreground/40">@{entry.username}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-primary tabular-nums">{entry.taps.toLocaleString()}</p>
                  <p className="text-xs text-foreground/40">taps</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── History List ─────────────────────────────────────────────────────────────

export default function GameHistoryPanel({ eventId }: GameHistoryPanelProps) {
  const [history, setHistory] = useState<ActivitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    ActivityService.list(eventId)
      .then((items) => setHistory(items.filter((a) => a.status === "ENDED")))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventId]);

  if (selectedId) {
    return (
      <DetailView
        eventId={eventId}
        activityId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-3 mt-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-foreground/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground/60 uppercase tracking-wide">
          GameController History
        </h4>
        <span className="text-xs text-foreground/40">{history.length} game{history.length !== 1 ? "s" : ""}</span>
      </div>

      <ul className="space-y-2">
        {history.map((activity) => {
          const r = activity.results as any;
          const isLucky = activity.type === "LUCKY_DRAW";
          const summary = isLucky
            ? r?.winners?.[0]?.name
              ? `Winner: ${r.winners[0].name}`
              : r?.totalPool
              ? `${r.totalPool} participants`
              : null
            : r?.totalTaps
            ? `${Number(r.totalTaps).toLocaleString()} taps · ${r.participantCount ?? activity._count.entries} participants`
            : activity._count.entries > 0
            ? `${activity._count.entries} participants`
            : null;

          return (
            <li key={activity.id}>
              <button
                onClick={() => setSelectedId(activity.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-left cursor-pointer group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isLucky ? "bg-yellow-500/10" : "bg-primary/10"}`}>
                  {isLucky
                    ? <Gift size={17} color="#f59e0b" weight="fill" />
                    : <MusicNote size={17} color="currentColor" weight="fill" className="text-primary" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {isLucky ? "Lucky Draw" : "Applause Meter"}
                    </span>
                    <GameTypeBadge type={activity.type} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-foreground/40">{formatDate(activity.createdAt)}</span>
                    {summary && <span className="text-xs text-foreground/60 truncate">{summary}</span>}
                  </div>
                </div>
                <ArrowLeft size={15} color="currentColor" className="text-foreground/30 group-hover:text-foreground/60 rotate-180 shrink-0 transition-colors" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
