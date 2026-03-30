"use client";

import React, { useState } from "react";
import { useActivity } from "@/hooks/useActivity";
import Button from "@/components/Button";
import {
  Gift,
  People,
  Play,
  Stop,
  Crown,
  CloseCircle,
  Refresh,
  Music,
  Flash,
  Timer,
} from "iconsax-react";
import Image from "next/image";

interface OrganizerGamePanelProps {
  eventId: string;
}

const DURATION_OPTIONS = [
  { label: "10s", value: 10 },
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
  { label: "2 min", value: 120 },
];

const OrganizerGamePanel: React.FC<OrganizerGamePanelProps> = ({ eventId }) => {
  const {
    activeActivity,
    drawWinners,
    drawTotalPool,
    showDrawReveal,
    drawCountdown,
    totalTaps,
    participantCount,
    leaderboard,
    applauseTimeLeft,
    isLoading,
    createAndStart,
    performDraw,
    endActivity,
    hideReveal,
  } = useActivity(eventId, true);

  const [launching, setLaunching] = useState<"LUCKY_DRAW" | "APPLAUSE_METER" | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(30);

  const handleLaunchLucky = async () => {
    setLaunching("LUCKY_DRAW");
    try {
      await createAndStart("LUCKY_DRAW");
    } finally {
      setLaunching(null);
    }
  };

  const handleLaunchApplause = async () => {
    setLaunching("APPLAUSE_METER");
    try {
      await createAndStart("APPLAUSE_METER", { durationSeconds: selectedDuration });
    } finally {
      setLaunching(null);
    }
  };

  const handleDraw = async () => {
    if (!activeActivity) return;
    await performDraw(activeActivity.id);
  };

  const handleEnd = async () => {
    if (!activeActivity) return;
    await endActivity(activeActivity.id);
  };

  // ----- No active game -----
  if (!activeActivity) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            Live Games
          </h3>
          <p className="text-sm text-foreground/60 mt-1">
            Launch a real-time interactive activity for your attendees. Only one
            game can be active at a time.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Lucky Draw */}
          <div className="bg-background border border-foreground/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Gift size={24} color="#f59e0b" variant="Bold" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-lg">Lucky Draw</h4>
              <p className="text-sm text-foreground/60 mt-1">
                Randomly pick winner(s) from everyone who registered for the
                event. Zero setup required.
              </p>
            </div>
            <ul className="text-xs text-foreground/50 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-yellow-400 inline-block" />
                Attendee pool sourced from ticket holders
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-yellow-400 inline-block" />
                Animated reveal shown to everyone live
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-yellow-400 inline-block" />
                You control when to draw and end
              </li>
            </ul>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Play}
              onClick={handleLaunchLucky}
              disabled={!!launching}
            >
              {launching === "LUCKY_DRAW" ? "Launching…" : "Launch Lucky Draw"}
            </Button>
          </div>

          {/* Applause Meter */}
          <div className="bg-background border border-foreground/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Music size={24} color="currentColor" variant="Bold" className="text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-lg">Applause Meter</h4>
              <p className="text-sm text-foreground/60 mt-1">
                Attendees tap as fast as they can within a time window. Watch
                the leaderboard climb in real time.
              </p>
            </div>
            <ul className="text-xs text-foreground/50 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                Set a time window — game auto-ends
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                Live top-5 leaderboard as taps roll in
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                Attendees see their own tap count
              </li>
            </ul>

            {/* Duration selector */}
            <div>
              <p className="text-xs text-foreground/50 mb-2 flex items-center gap-1.5">
                <Timer size={13} color="currentColor" />
                Time window
              </p>
              <div className="flex gap-2 flex-wrap">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedDuration(opt.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      selectedDuration === opt.value
                        ? "bg-primary text-white border-primary"
                        : "bg-foreground/5 text-foreground/60 border-foreground/10 hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={Flash}
              onClick={handleLaunchApplause}
              disabled={!!launching}
            >
              {launching === "APPLAUSE_METER" ? "Launching…" : `Launch — ${DURATION_OPTIONS.find(o => o.value === selectedDuration)?.label}`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ----- Lucky Draw active -----
  if (activeActivity.type === "LUCKY_DRAW") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Gift size={20} color="#f59e0b" variant="Bold" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Lucky Draw — Live</h3>
              <p className="text-xs text-foreground/50">
                {drawTotalPool > 0
                  ? `${drawTotalPool} eligible ticket holders`
                  : "Fetching participant count…"}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Active
          </span>
        </div>

        {/* Countdown before reveal */}
        {drawCountdown !== null && (
          <div className="bg-background border border-yellow-500/20 rounded-2xl p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" style={{ animationDuration: "1s" }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-yellow-400 tabular-nums">{drawCountdown}</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground/70">Drawing winner — attendees are watching…</p>
          </div>
        )}

        {/* Winner reveal area */}
        {!drawCountdown && showDrawReveal && drawWinners.length > 0 ? (
          <div className="relative bg-gradient-to-br from-yellow-500/10 to-amber-600/5 border border-yellow-500/20 rounded-2xl p-6">
            <button
              onClick={hideReveal}
              className="absolute top-3 right-3 text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer"
            >
              <CloseCircle size={20} color="currentColor" variant="Bold" />
            </button>
            <div className="text-center mb-4">
              <Crown size={32} color="#f59e0b" variant="Bold" className="mx-auto mb-2" />
              <h4 className="font-bold text-foreground text-lg">
                {drawWinners.length === 1 ? "We have a winner!" : `${drawWinners.length} winners!`}
              </h4>
              <p className="text-xs text-foreground/50">Drawn from {drawTotalPool} participants</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {drawWinners.map((winner, i) => (
                <div key={winner.userId} className="flex flex-col items-center gap-2">
                  <div className="relative w-16 h-16">
                    {winner.avatar ? (
                      <Image
                        src={winner.avatar}
                        alt={winner.name}
                        fill
                        className="rounded-full object-cover ring-2 ring-yellow-400"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-yellow-500/20 ring-2 ring-yellow-400 flex items-center justify-center text-xl font-bold text-yellow-500">
                        {winner.name.charAt(0)}
                      </div>
                    )}
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-yellow-400 text-xs font-bold text-white flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">{winner.name}</p>
                    {winner.username && (
                      <p className="text-xs text-foreground/50">@{winner.username}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !drawCountdown && (
            <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                <Gift size={32} color="#f59e0b" variant="Bold" />
              </div>
              <p className="text-foreground/60 text-sm">
                Attendees can see the Lucky Draw is live. Hit Draw when you're ready to pick a winner.
              </p>
            </div>
          )
        )}

        <div className="flex gap-3">
          <Button
            variant="primary"
            size="md"
            leftIcon={showDrawReveal ? Refresh : Crown}
            onClick={handleDraw}
            disabled={isLoading || drawCountdown !== null}
            className="flex-1"
          >
            {isLoading ? "Drawing…" : drawCountdown !== null ? `Revealing in ${drawCountdown}…` : showDrawReveal ? "Draw Again" : "Draw Winner"}
          </Button>
          <Button
            variant="outline"
            size="md"
            leftIcon={Stop}
            onClick={handleEnd}
            disabled={isLoading}
          >
            End Game
          </Button>
        </div>
      </div>
    );
  }

  // ----- Applause Meter active -----
  if (activeActivity.type === "APPLAUSE_METER") {
    const percent = participantCount > 0 ? Math.min((totalTaps / (participantCount * 10)) * 100, 100) : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Music size={20} color="currentColor" variant="Bold" className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Applause Meter — Live</h3>
              <p className="text-xs text-foreground/50">
                {participantCount} participant{participantCount !== 1 ? "s" : ""} tapping
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {applauseTimeLeft !== null && applauseTimeLeft > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold">
                <Timer size={12} color="currentColor" />
                {applauseTimeLeft}s left
              </div>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Active
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background border border-foreground/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold font-[family-name:var(--font-clash-display)] text-primary tabular-nums">
              {totalTaps.toLocaleString()}
            </div>
            <p className="text-foreground/50 text-xs mt-1">total taps</p>
          </div>
          <div className="bg-background border border-foreground/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold font-[family-name:var(--font-clash-display)] text-foreground tabular-nums">
              {participantCount}
            </div>
            <p className="text-foreground/50 text-xs mt-1">participants</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2.5 bg-foreground/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Top-5 Leaderboard */}
        <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-foreground/5 flex items-center gap-2">
            <Crown size={15} color="#f59e0b" variant="Bold" />
            <span className="text-sm font-semibold text-foreground">Live Leaderboard</span>
            <span className="text-xs text-foreground/40 ml-auto">Top 5</span>
          </div>
          {leaderboard.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-foreground/40">
              Waiting for first taps…
            </div>
          ) : (
            <ul className="divide-y divide-foreground/5">
              {leaderboard.map((entry, i) => (
                <li key={entry.userId} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0
                        ? "bg-yellow-400 text-white"
                        : i === 1
                        ? "bg-slate-300 text-slate-700"
                        : i === 2
                        ? "bg-amber-600 text-white"
                        : "bg-foreground/10 text-foreground/60"
                    }`}
                  >
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
                  <span className="flex-1 text-sm font-medium text-foreground truncate">{entry.name}</span>
                  <span className="text-sm font-bold text-primary tabular-nums">{entry.taps.toLocaleString()}</span>
                  <span className="text-xs text-foreground/40">taps</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-foreground/5 rounded-xl p-3 flex items-center gap-2 text-foreground/60">
            <People size={16} color="currentColor" variant="Outline" />
            <span className="text-xs">Attendees see a live tap button on their screen</span>
          </div>
          <Button
            variant="outline"
            size="md"
            leftIcon={Stop}
            onClick={handleEnd}
            disabled={isLoading}
          >
            End Game
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default OrganizerGamePanel;
