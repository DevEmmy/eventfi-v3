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
} from "iconsax-react";
import Image from "next/image";

interface OrganizerGamePanelProps {
  eventId: string;
}

const OrganizerGamePanel: React.FC<OrganizerGamePanelProps> = ({ eventId }) => {
  const {
    activeActivity,
    drawWinners,
    drawTotalPool,
    showDrawReveal,
    totalTaps,
    participantCount,
    isLoading,
    createAndStart,
    performDraw,
    endActivity,
    hideReveal,
  } = useActivity(eventId, true);

  const [launching, setLaunching] = useState<"LUCKY_DRAW" | "APPLAUSE_METER" | null>(null);

  const handleLaunch = async (type: "LUCKY_DRAW" | "APPLAUSE_METER") => {
    setLaunching(type);
    try {
      await createAndStart(type);
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
              onClick={() => handleLaunch("LUCKY_DRAW")}
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
                Attendees tap a button as fast as they can. A live counter shows
                the energy in the room in real time.
              </p>
            </div>
            <ul className="text-xs text-foreground/50 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                No config needed — just launch
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                Live tap count updates for everyone
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                Rate-limited to prevent spam
              </li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Flash}
              onClick={() => handleLaunch("APPLAUSE_METER")}
              disabled={!!launching}
            >
              {launching === "APPLAUSE_METER" ? "Launching…" : "Launch Applause Meter"}
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

        {/* Winner reveal area */}
        {showDrawReveal && drawWinners.length > 0 ? (
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
          <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
              <Gift size={32} color="#f59e0b" variant="Bold" />
            </div>
            <p className="text-foreground/60 text-sm">
              Attendees can see the Lucky Draw is live. Hit Draw when you're ready to pick a winner.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="primary"
            size="md"
            leftIcon={showDrawReveal ? Refresh : Crown}
            onClick={handleDraw}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Drawing…" : showDrawReveal ? "Draw Again" : "Draw Winner"}
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
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Active
          </span>
        </div>

        {/* Live counter */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6 text-center">
          <div className="text-5xl font-bold font-[family-name:var(--font-clash-display)] text-primary tabular-nums">
            {totalTaps.toLocaleString()}
          </div>
          <p className="text-foreground/60 text-sm mt-1">total taps</p>

          {/* Progress bar */}
          <div className="mt-4 h-3 bg-foreground/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-foreground/40 mt-2">
            {participantCount} unique participant{participantCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-foreground/5 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-foreground/60">
              <People size={18} color="currentColor" variant="Outline" />
              <span className="text-sm">Attendees see a live tap button on their screen</span>
            </div>
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
