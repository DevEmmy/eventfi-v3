"use client";

import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
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
import { LeaderboardEntry } from "@/store/useActivityStore";

interface OrganizerGamePanelProps {
  eventId: string;
}

const DURATION_OPTIONS = [
  { label: "10s", value: 10 },
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
  { label: "2 min", value: 120 },
];

// Podium layout: display order [2nd, 1st, 3rd]
const PODIUM_ORDER = [1, 0, 2];
const PODIUM_HEIGHTS = ["h-20", "h-28", "h-16"];
const PODIUM_COLORS = [
  "bg-slate-300/20 border-slate-300/40",
  "bg-yellow-400/20 border-yellow-400/50",
  "bg-amber-600/20 border-amber-600/40",
];
const PODIUM_RING = ["ring-slate-300", "ring-yellow-400", "ring-amber-600"];
const PODIUM_LABEL_COLOR = ["text-slate-300", "text-yellow-400", "text-amber-600"];
const PODIUM_RANK_LABEL = ["2nd", "1st", "3rd"];

function ApplausePodium({
  results,
  totalTaps,
  onDone,
}: {
  results: LeaderboardEntry[];
  totalTaps: number;
  onDone: () => void;
}) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current || results.length === 0) return;
    hasFired.current = true;
    const end = Date.now() + 3500;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors: ["#f59e0b", "#6366f1", "#ec4899", "#10b981"] });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors: ["#f59e0b", "#6366f1", "#ec4899", "#10b981"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [results]);

  const slots = PODIUM_ORDER.map((idx) => results[idx] ?? null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-(family-name:--font-clash-display) text-foreground">
            Applause Results!
          </h3>
          <p className="text-sm text-foreground/60 mt-1">
            {totalTaps.toLocaleString()} total taps · top 3 tappers
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-foreground/5 text-foreground/50 text-xs font-semibold">
          Game ended
        </span>
      </div>

      {/* Podium */}
      <div className="bg-background border border-foreground/10 rounded-2xl p-6">
        <div className="flex items-end justify-center gap-4">
          {slots.map((entry, slotIdx) => {
            const rank = PODIUM_ORDER[slotIdx];
            return (
              <div
                key={slotIdx}
                className="flex flex-col items-center gap-2 flex-1"
                style={{ animation: `fadeInUp 0.4s ease both`, animationDelay: `${slotIdx * 0.2}s` }}
              >
                {entry ? (
                  <>
                    <div className={`relative w-14 h-14 rounded-full ring-2 ${PODIUM_RING[rank]} overflow-hidden bg-foreground/10`}>
                      {entry.avatar ? (
                        <Image src={entry.avatar} alt={entry.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm text-foreground/60">
                          {entry.name.charAt(0)}
                        </div>
                      )}
                      {rank === 0 && <span className="absolute -top-1 -right-1 text-xs">👑</span>}
                    </div>
                    <p className="text-xs font-semibold text-foreground text-center truncate w-full px-1">
                      {entry.name.split(" ")[0]}
                    </p>
                    <p className={`text-xs font-bold tabular-nums ${PODIUM_LABEL_COLOR[rank]}`}>
                      {entry.taps.toLocaleString()}
                    </p>
                  </>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-foreground/5" />
                )}
                <div className={`w-full rounded-t-lg border ${PODIUM_COLORS[rank]} ${PODIUM_HEIGHTS[slotIdx]} flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${PODIUM_LABEL_COLOR[rank]}`}>
                    {PODIUM_RANK_LABEL[slotIdx]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button variant="primary" size="md" leftIcon={Stop} onClick={onDone} className="w-full">
        End Game &amp; Close
      </Button>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

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
    applauseResults,
    showApplauseResults,
    isLoading,
    createAndStart,
    performDraw,
    endActivity,
    hideReveal,
    hideApplauseResults,
  } = useActivity(eventId, true);

  const [launching, setLaunching] = useState<"LUCKY_DRAW" | "APPLAUSE_METER" | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(30);

  // Confetti when Lucky Draw winner is revealed
  useEffect(() => {
    if (!showDrawReveal || drawCountdown !== null || drawWinners.length === 0) return;
    const end = Date.now() + 3500;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors: ["#f59e0b", "#6366f1", "#ec4899", "#10b981"] });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors: ["#f59e0b", "#6366f1", "#ec4899", "#10b981"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [showDrawReveal, drawCountdown]);

  const handleLaunchLucky = async () => {
    setLaunching("LUCKY_DRAW");
    try { await createAndStart("LUCKY_DRAW"); }
    finally { setLaunching(null); }
  };

  const handleLaunchApplause = async () => {
    setLaunching("APPLAUSE_METER");
    try { await createAndStart("APPLAUSE_METER", { durationSeconds: selectedDuration }); }
    finally { setLaunching(null); }
  };

  const handleDraw = async () => {
    if (!activeActivity) return;
    await performDraw(activeActivity.id);
  };

  const handleEnd = async () => {
    if (!activeActivity) return;
    await endActivity(activeActivity.id);
  };

  // ----- Applause results podium -----
  if (showApplauseResults && applauseResults.length > 0) {
    return (
      <ApplausePodium
        results={applauseResults}
        totalTaps={totalTaps}
        onDone={() => { hideApplauseResults(); }}
      />
    );
  }

  // ----- No active game -----
  if (!activeActivity) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold font-(family-name:--font-clash-display) text-foreground">
            Live Games
          </h3>
          <p className="text-sm text-foreground/60 mt-1">
            Launch a real-time interactive activity for your attendees. Only one game can be active at a time.
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
                Randomly pick winner(s) from everyone who registered. Zero setup required.
              </p>
            </div>
            <ul className="text-xs text-foreground/50 space-y-1">
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-yellow-400 inline-block" />Attendee pool sourced from ticket holders</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-yellow-400 inline-block" />Animated reveal shown to everyone live</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-yellow-400 inline-block" />You control when to draw and end</li>
            </ul>
            <Button variant="primary" size="sm" leftIcon={Play} onClick={handleLaunchLucky} disabled={!!launching}>
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
                Attendees tap within a time window. Watch the leaderboard climb in real time.
              </p>
            </div>
            <ul className="text-xs text-foreground/50 space-y-1">
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-primary inline-block" />Set a time window — game auto-ends</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-primary inline-block" />Live top-5 leaderboard as taps roll in</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-primary inline-block" />Attendees see their own tap count</li>
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

            <Button variant="outline" size="sm" leftIcon={Flash} onClick={handleLaunchApplause} disabled={!!launching}>
              {launching === "APPLAUSE_METER" ? "Launching…" : `Launch — ${DURATION_OPTIONS.find((o) => o.value === selectedDuration)?.label}`}
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
                {drawTotalPool > 0 ? `${drawTotalPool} eligible ticket holders` : "Fetching participant count…"}
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
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" style={{ animationDuration: "1s" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-yellow-400 tabular-nums">{drawCountdown}</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground/70">Drawing winner — attendees are watching…</p>
          </div>
        )}

        {/* Winner reveal */}
        {!drawCountdown && showDrawReveal && drawWinners.length > 0 ? (
          <div className="relative bg-linear-to-br from-yellow-500/10 to-amber-600/5 border border-yellow-500/20 rounded-2xl p-6">
            <button onClick={hideReveal} className="absolute top-3 right-3 text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer">
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
                      <Image src={winner.avatar} alt={winner.name} fill className="rounded-full object-cover ring-2 ring-yellow-400" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-yellow-500/20 ring-2 ring-yellow-400 flex items-center justify-center text-xl font-bold text-yellow-500">
                        {winner.name.charAt(0)}
                      </div>
                    )}
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-yellow-400 text-xs font-bold text-white flex items-center justify-center">{i + 1}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">{winner.name}</p>
                    {winner.username && <p className="text-xs text-foreground/50">@{winner.username}</p>}
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
          <Button variant="outline" size="md" leftIcon={Stop} onClick={handleEnd} disabled={isLoading}>
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
            <div className="text-3xl font-bold font-(family-name:--font-clash-display) text-primary tabular-nums">
              {totalTaps.toLocaleString()}
            </div>
            <p className="text-foreground/50 text-xs mt-1">total taps</p>
          </div>
          <div className="bg-background border border-foreground/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold font-(family-name:--font-clash-display) text-foreground tabular-nums">
              {participantCount}
            </div>
            <p className="text-foreground/50 text-xs mt-1">participants</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2.5 bg-foreground/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-300"
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
                  <span className="flex-1 text-sm font-medium text-foreground truncate">{entry.name}</span>
                  <span className="text-sm font-bold text-primary tabular-nums">{entry.taps.toLocaleString()}</span>
                  <span className="text-xs text-foreground/40">taps</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex-1 bg-foreground/5 rounded-xl p-3 flex items-center gap-2 text-foreground/60">
            <People size={16} color="currentColor" variant="Outline" />
            <span className="text-xs">Attendees see a live tap button on their screen</span>
          </div>
          {/* Only show End Game once the timer has expired */}
          {(applauseTimeLeft === null || applauseTimeLeft <= 0) && (
            <Button variant="outline" size="md" leftIcon={Stop} onClick={handleEnd} disabled={isLoading}>
              End Game
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default OrganizerGamePanel;
