"use client";

import React, { useEffect, useRef } from "react";
import { useActivity } from "@/hooks/useActivity";
import { Gift, Crown, CloseCircle, Music } from "iconsax-react";
import Image from "next/image";

interface AttendeeGameViewProps {
  eventId: string;
}

const AttendeeGameView: React.FC<AttendeeGameViewProps> = ({ eventId }) => {
  const {
    activeActivity,
    drawWinners,
    drawTotalPool,
    showDrawReveal,
    totalTaps,
    participantCount,
    tapApplause,
    hideReveal,
  } = useActivity(eventId, false);

  // Animate the tap button scale on click
  const tapBtnRef = useRef<HTMLButtonElement>(null);

  const handleTap = () => {
    if (!activeActivity) return;
    tapApplause(activeActivity.id);

    // Micro-animation: scale down then back up
    if (tapBtnRef.current) {
      tapBtnRef.current.classList.add("scale-90");
      setTimeout(() => {
        tapBtnRef.current?.classList.remove("scale-90");
      }, 100);
    }
  };

  // Auto-hide draw reveal after 10s on attendee side
  useEffect(() => {
    if (!showDrawReveal) return;
    const timer = setTimeout(hideReveal, 10000);
    return () => clearTimeout(timer);
  }, [showDrawReveal]);

  if (!activeActivity) return null;

  // ----- Lucky Draw -----
  if (activeActivity.type === "LUCKY_DRAW") {
    // Draw in progress — no result yet
    if (!showDrawReveal || drawWinners.length === 0) {
      return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
          <div className="bg-background border border-yellow-500/30 shadow-2xl rounded-2xl p-5 flex items-center gap-4 animate-slide-up">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 animate-pulse">
              <Gift size={24} color="#f59e0b" variant="Bold" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">Lucky Draw is Live!</p>
              <p className="text-xs text-foreground/50 mt-0.5">
                Stay tuned — the organizer is about to draw a winner
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Winner revealed
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-background border border-yellow-500/30 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center relative animate-scale-in">
          <button
            onClick={hideReveal}
            className="absolute top-3 right-3 text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer"
          >
            <CloseCircle size={20} color="currentColor" variant="Bold" />
          </button>

          {/* Confetti dots */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-70 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1}s`,
                  backgroundColor: ["#f59e0b", "#6366f1", "#ec4899", "#10b981"][i % 4],
                }}
              />
            ))}
          </div>

          <Crown size={40} color="#f59e0b" variant="Bold" className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-1">
            {drawWinners.length === 1 ? "🎉 Winner!" : `🎉 ${drawWinners.length} Winners!`}
          </h3>
          <p className="text-xs text-foreground/50 mb-6">
            Drawn from {drawTotalPool} participants
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {drawWinners.map((winner, i) => (
              <div key={winner.userId} className="flex flex-col items-center gap-2">
                <div className="relative w-20 h-20">
                  {winner.avatar ? (
                    <Image
                      src={winner.avatar}
                      alt={winner.name}
                      fill
                      className="rounded-full object-cover ring-4 ring-yellow-400"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-yellow-500/20 ring-4 ring-yellow-400 flex items-center justify-center text-2xl font-bold text-yellow-500">
                      {winner.name.charAt(0)}
                    </div>
                  )}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 text-xs font-bold text-white flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{winner.name}</p>
                  {winner.username && (
                    <p className="text-xs text-foreground/50">@{winner.username}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----- Applause Meter -----
  if (activeActivity.type === "APPLAUSE_METER") {
    const percent = participantCount > 0
      ? Math.min((totalTaps / (participantCount * 10)) * 100, 100)
      : 0;

    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
        <div className="bg-background border border-primary/30 shadow-2xl rounded-2xl p-5 animate-slide-up">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Music size={16} color="currentColor" variant="Bold" className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-sm">Applause Meter</p>
              <p className="text-xs text-foreground/50">Tap as fast as you can!</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-primary tabular-nums">
                {totalTaps.toLocaleString()}
              </div>
              <div className="text-xs text-foreground/40">{participantCount} tapping</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-foreground/5 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Big tap button */}
          <button
            ref={tapBtnRef}
            onClick={handleTap}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg transition-transform duration-100 active:scale-95 hover:bg-primary/90 cursor-pointer select-none"
          >
            👏 TAP!
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AttendeeGameView;
