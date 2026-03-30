"use client";

import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useActivity } from "@/hooks/useActivity";
import { Gift, Crown, CloseCircle, Music, Timer } from "iconsax-react";
import Image from "next/image";
import { LeaderboardEntry } from "@/store/useActivityStore";

interface AttendeeGameViewProps {
  eventId: string;
}

// Podium slot config: order of display is [2nd, 1st, 3rd]
const PODIUM_ORDER = [1, 0, 2]; // index into applauseResults
const PODIUM_HEIGHTS = ["h-20", "h-28", "h-16"];
const PODIUM_COLORS = [
  "bg-slate-300/20 border-slate-300/40",
  "bg-yellow-400/20 border-yellow-400/50",
  "bg-amber-600/20 border-amber-600/40",
];
const PODIUM_RING = ["ring-slate-300", "ring-yellow-400", "ring-amber-600"];
const PODIUM_LABEL_COLOR = ["text-slate-300", "text-yellow-400", "text-amber-600"];
const PODIUM_RANK = ["2nd", "1st", "3rd"];

function ApplausePodium({
  results,
  onClose,
}: {
  results: LeaderboardEntry[];
  onClose: () => void;
}) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current || results.length === 0) return;
    hasFired.current = true;

    const end = Date.now() + 3500;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ["#f59e0b", "#6366f1", "#ec4899", "#10b981", "#3b82f6"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ["#f59e0b", "#6366f1", "#ec4899", "#10b981", "#3b82f6"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [results]);

  const slots = PODIUM_ORDER.map((idx) => results[idx] ?? null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-background border border-foreground/10 rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer z-10"
        >
          <CloseCircle size={20} color="currentColor" variant="Bold" />
        </button>

        {/* Header */}
        <div className="pt-8 pb-4 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Music size={24} color="currentColor" variant="Bold" className="text-primary" />
          </div>
          <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
            Applause Results!
          </h3>
          <p className="text-xs text-foreground/50 mt-1">Top tappers of the round</p>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-3 px-6 pb-6">
          {slots.map((entry, slotIdx) => {
            const rank = PODIUM_ORDER[slotIdx]; // 0-based rank
            return (
              <div
                key={slotIdx}
                className="flex flex-col items-center gap-2 flex-1"
                style={{
                  animation: `fadeInUp 0.4s ease both`,
                  animationDelay: `${slotIdx * 0.18}s`,
                }}
              >
                {entry ? (
                  <>
                    {/* Avatar */}
                    <div
                      className={`relative w-12 h-12 rounded-full ring-2 ${PODIUM_RING[rank]} overflow-hidden bg-foreground/10`}
                    >
                      {entry.avatar ? (
                        <Image
                          src={entry.avatar}
                          alt={entry.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm text-foreground/60">
                          {entry.name.charAt(0)}
                        </div>
                      )}
                      {/* Rank badge */}
                      {rank === 0 && (
                        <span className="absolute -top-1 -right-1 text-xs">👑</span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-foreground text-center truncate w-full px-1">
                      {entry.name.split(" ")[0]}
                    </p>
                    <p className={`text-xs font-bold ${PODIUM_LABEL_COLOR[rank]}`}>
                      {entry.taps.toLocaleString()} taps
                    </p>
                  </>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-foreground/5" />
                )}

                {/* Podium block */}
                <div
                  className={`w-full rounded-t-lg border ${PODIUM_COLORS[rank]} ${PODIUM_HEIGHTS[slotIdx]} flex items-center justify-center`}
                >
                  <span className={`text-sm font-bold ${PODIUM_LABEL_COLOR[rank]}`}>
                    {PODIUM_RANK[slotIdx]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const AttendeeGameView: React.FC<AttendeeGameViewProps> = ({ eventId }) => {
  const {
    activeActivity,
    drawWinners,
    drawTotalPool,
    showDrawReveal,
    drawCountdown,
    totalTaps,
    participantCount,
    myTaps,
    applauseTimeLeft,
    applauseResults,
    showApplauseResults,
    tapApplause,
    hideReveal,
    hideApplauseResults,
  } = useActivity(eventId, false);

  const tapBtnRef = useRef<HTMLButtonElement>(null);

  const handleTap = () => {
    if (!activeActivity) return;
    tapApplause(activeActivity.id);
    if (tapBtnRef.current) {
      tapBtnRef.current.classList.add("scale-90");
      setTimeout(() => tapBtnRef.current?.classList.remove("scale-90"), 100);
    }
  };

  // Fire confetti when Lucky Draw winner is revealed
  useEffect(() => {
    if (!showDrawReveal || drawWinners.length === 0) return;
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#f59e0b", "#6366f1", "#ec4899", "#10b981"] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#f59e0b", "#6366f1", "#ec4899", "#10b981"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [showDrawReveal]);

  // Auto-hide Lucky Draw winner reveal after 15s
  useEffect(() => {
    if (!showDrawReveal) return;
    const t = setTimeout(hideReveal, 15000);
    return () => clearTimeout(t);
  }, [showDrawReveal]);

  // Applause results podium
  if (showApplauseResults && applauseResults.length > 0) {
    return <ApplausePodium results={applauseResults} onClose={hideApplauseResults} />;
  }

  if (!activeActivity) return null;

  // ─── Lucky Draw ──────────────────────────────────────────────────────────────

  if (activeActivity.type === "LUCKY_DRAW") {
    if (drawCountdown !== null) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" style={{ animationDuration: "1s" }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold font-[family-name:var(--font-clash-display)] text-yellow-400 tabular-nums">
                  {drawCountdown}
                </span>
              </div>
            </div>
            <Gift size={28} color="#f59e0b" variant="Bold" className="mx-auto mb-3" />
            <p className="text-white text-xl font-bold font-[family-name:var(--font-clash-display)]">Drawing a winner…</p>
            <p className="text-white/50 text-sm mt-1">Get ready!</p>
          </div>
        </div>
      );
    }

    if (showDrawReveal && drawWinners.length > 0) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-background border border-yellow-500/30 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center relative">
            <button onClick={hideReveal} className="absolute top-3 right-3 text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer">
              <CloseCircle size={20} color="currentColor" variant="Bold" />
            </button>
            <Crown size={40} color="#f59e0b" variant="Bold" className="mx-auto mb-3" />
            <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-1">
              {drawWinners.length === 1 ? "🎉 Winner!" : `🎉 ${drawWinners.length} Winners!`}
            </h3>
            <p className="text-xs text-foreground/50 mb-6">Drawn from {drawTotalPool} participants</p>
            <div className="flex flex-wrap justify-center gap-4">
              {drawWinners.map((winner, i) => (
                <div key={winner.userId} className="flex flex-col items-center gap-2">
                  <div className="relative w-20 h-20">
                    {winner.avatar ? (
                      <Image src={winner.avatar} alt={winner.name} fill className="rounded-full object-cover ring-4 ring-yellow-400" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-yellow-500/20 ring-4 ring-yellow-400 flex items-center justify-center text-2xl font-bold text-yellow-500">
                        {winner.name.charAt(0)}
                      </div>
                    )}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 text-xs font-bold text-white flex items-center justify-center">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{winner.name}</p>
                    {winner.username && <p className="text-xs text-foreground/50">@{winner.username}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-background border border-yellow-500/30 shadow-2xl rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 animate-pulse">
            <Gift size={24} color="#f59e0b" variant="Bold" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground text-sm">Lucky Draw is Live!</p>
            <p className="text-xs text-foreground/50 mt-0.5">Stay tuned — the organizer is about to draw a winner</p>
          </div>
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
            Live
          </span>
        </div>
      </div>
    );
  }

  // ─── Applause Meter ──────────────────────────────────────────────────────────

  if (activeActivity.type === "APPLAUSE_METER") {
    const percent = participantCount > 0 ? Math.min((totalTaps / (participantCount * 10)) * 100, 100) : 0;
    const timeExpired = applauseTimeLeft !== null && applauseTimeLeft <= 0;

    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
        <div className="bg-background border border-primary/30 shadow-2xl rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Music size={16} color="currentColor" variant="Bold" className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-sm">Applause Meter</p>
              <p className="text-xs text-foreground/50">{timeExpired ? "Time's up!" : "Tap as fast as you can!"}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-primary tabular-nums">
                {totalTaps.toLocaleString()}
              </div>
              <div className="text-xs text-foreground/40">{participantCount} tapping</div>
            </div>
          </div>

          {applauseTimeLeft !== null && (
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center gap-1 text-xs font-semibold ${applauseTimeLeft <= 5 ? "text-red-400" : "text-orange-400"}`}>
                <Timer size={12} color="currentColor" />
                {timeExpired ? "Ended" : `${applauseTimeLeft}s left`}
              </div>
              {myTaps > 0 && (
                <div className="text-xs text-foreground/50">
                  Your taps: <span className="font-bold text-foreground">{myTaps}</span>
                </div>
              )}
            </div>
          )}

          <div className="h-2 bg-foreground/5 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
          </div>

          <button
            ref={tapBtnRef}
            onClick={handleTap}
            disabled={timeExpired}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg transition-transform duration-100 active:scale-95 hover:bg-primary/90 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {timeExpired ? "⏰ Time's up!" : `👏 TAP! ${myTaps > 0 ? `(${myTaps})` : ""}`}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AttendeeGameView;
