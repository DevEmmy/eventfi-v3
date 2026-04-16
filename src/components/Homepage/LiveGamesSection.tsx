"use client";

import React, { useState } from "react";
import { Gift, MusicNote, Crown, Users, Lightning, CheckCircle } from '@phosphor-icons/react';

// Animated Lucky Draw mockup
const LuckyDrawMockup = () => {
  const attendees = [
    { initials: "AK", color: "bg-yellow-500/20 text-yellow-500" },
    { initials: "FM", color: "bg-primary/20 text-primary" },
    { initials: "OU", color: "bg-secondary/20 text-secondary" },
    { initials: "NB", color: "bg-accent/20 text-accent" },
    { initials: "TJ", color: "bg-green-500/20 text-green-500" },
    { initials: "RL", color: "bg-pink-500/20 text-pink-500" },
  ];

  return (
    <div className="h-full p-4 flex flex-col gap-3">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift size={16} color="#f59e0b" weight="fill" />
          <div className="h-2.5 bg-yellow-500/40 rounded w-20"></div>
        </div>
        <span className="text-xs font-bold text-green-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
          Live
        </span>
      </div>

      {/* Attendee pool */}
      <div className="flex flex-wrap gap-1.5">
        {attendees.map((a, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-xs font-bold`}
          >
            {a.initials}
          </div>
        ))}
        <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-xs text-foreground/40 font-bold">
          +94
        </div>
      </div>

      {/* Winner card */}
      <div className="flex-1 flex flex-col items-center justify-center bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
        <Crown size={20} color="#f59e0b" weight="fill" className="mb-1" />
        <div className="w-10 h-10 rounded-full bg-yellow-500/20 ring-2 ring-yellow-400 flex items-center justify-center text-sm font-bold text-yellow-500 mb-1">
          AK
        </div>
        <div className="h-2 bg-yellow-500/40 rounded w-16 mb-1"></div>
        <div className="h-1.5 bg-yellow-500/20 rounded w-10"></div>
      </div>

      {/* Draw button */}
      <div className="h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center gap-2">
        <Crown size={14} color="#f59e0b" weight="fill" />
        <div className="h-2 bg-yellow-500/40 rounded w-16"></div>
      </div>
    </div>
  );
};

// Animated Applause Meter mockup
const ApplauseMockup = () => {
  const [taps, setTaps] = useState(1247);
  const percent = Math.min((taps / 2000) * 100, 100);

  const handleTap = () => setTaps((t) => t + Math.floor(Math.random() * 5) + 1);

  return (
    <div className="h-full p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MusicNote size={16} color="currentColor" weight="fill" className="text-primary" />
          <div className="h-2.5 bg-primary/40 rounded w-24"></div>
        </div>
        <span className="text-xs font-bold text-green-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
          Live
        </span>
      </div>

      {/* Counter */}
      <div className="text-center">
        <div className="text-3xl font-bold font-[family-name:var(--font-clash-display)] text-primary tabular-nums">
          {taps.toLocaleString()}
        </div>
        <div className="text-xs text-foreground/40">total taps</div>
      </div>

      {/* Fill bar */}
      <div className="h-2.5 bg-foreground/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Tap button */}
      <button
        onClick={handleTap}
        className="flex-1 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
      >
        <span className="text-2xl select-none">👏</span>
        <span className="text-xs font-bold text-primary">TAP!</span>
      </button>

      {/* Participants */}
      <div className="flex items-center justify-center gap-1 text-xs text-foreground/40">
        <Users size={12} color="currentColor" weight="regular" />
        <span>38 people tapping</span>
      </div>
    </div>
  );
};

const games = [
  {
    id: "lucky-draw",
    title: "Lucky Draw",
    tagline: "Zero-config raffles, instant drama",
    description:
      "Randomly pick winner(s) from your registered attendees with one tap. No spreadsheets, no manual entry — EventFi sources the pool automatically from ticket holders.",
    icon: Gift,
    iconColor: "#f59e0b",
    iconBg: "bg-yellow-500/10",
    gradient: "from-yellow-500/10 via-yellow-500/5 to-background",
    border: "border-yellow-500/20",
    hoverBorder: "hover:border-yellow-500/40",
    accentText: "text-yellow-500",
    perks: [
      "Pool auto-filled from ticket holders",
      "Animated winner reveal for everyone",
      "Draw multiple winners at once",
    ],
    mockup: <LuckyDrawMockup />,
  },
  {
    id: "applause-meter",
    title: "Applause Meter",
    tagline: "Feel the energy of the room, live",
    description:
      "Give your audience a tap button and watch the excitement build in real time. Perfect for crowd reactions, speaker intros, or just hyping up the energy.",
    icon: MusicNote,
    iconColor: "currentColor",
    iconBg: "bg-primary/10",
    gradient: "from-primary/10 via-primary/5 to-background",
    border: "border-primary/20",
    hoverBorder: "hover:border-primary/40",
    accentText: "text-primary",
    perks: [
      "Live counter updates for the whole room",
      "Rate-limited taps — no bots",
      "Works on any device, no app install",
    ],
    mockup: <ApplauseMockup />,
  },
];

const LiveGamesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-foreground/[0.02]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Lightning size={14} color="currentColor" weight="fill" className="text-accent" />
            <span className="text-sm font-semibold text-accent">Live GameController Add-ons</span>
          </div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Turn Your Event Into{" "}
            <span className="text-primary">an Experience</span>
          </h2>
          <p className="text-lg lg:text-xl text-foreground/70 leading-relaxed">
            Launch interactive activities for your attendees in seconds — no
            setup, no config. Just pick a game and go live.
          </p>
        </div>

        {/* GameController Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className={`group relative bg-gradient-to-br ${game.gradient} rounded-2xl p-6 lg:p-8 border ${game.border} ${game.hoverBorder} transition-all duration-300 hover:shadow-xl overflow-hidden`}
              >
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -z-10 opacity-30 bg-current"></div>

                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl ${game.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      size={28}
                      color={game.iconColor}
                      weight="fill"
                    />
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                    <CheckCircle size={12} color="currentColor" weight="fill" />
                    Available Now
                  </span>
                </div>

                {/* Text */}
                <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-1">
                  {game.title}
                </h3>
                <p className={`text-sm font-semibold mb-3 ${game.accentText}`}>
                  {game.tagline}
                </p>
                <p className="text-foreground/70 text-sm leading-relaxed mb-5">
                  {game.description}
                </p>

                {/* Perks */}
                <ul className="space-y-2 mb-6">
                  {game.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                      <CheckCircle
                        size={14}
                        color="currentColor"
                        weight="fill"
                        className={game.accentText}
                      />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* Live mockup preview */}
                <div className="h-52 rounded-xl overflow-hidden bg-background/60 border border-foreground/10">
                  {game.mockup}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-foreground/40 mt-8">
          Games are launched from the event management dashboard and visible to all registered attendees in real time.
        </p>
      </div>
    </section>
  );
};

export default LiveGamesSection;
