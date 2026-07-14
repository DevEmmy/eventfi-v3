"use client";

import React from "react";
import { UsersThree, ChatCircleDots, QrCode, Wallet } from '@phosphor-icons/react';

const AdvancedToolsSection = () => {
  const tools = [
    {
      title: "Communities & Social Feed",
      description: "Don't let engagement die after the event. Build persistent groups, city chapters, follow other users, and post to a dedicated social feed.",
      icon: UsersThree,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      hoverBorder: "hover:border-primary/40",
      gradient: "from-primary/10 to-background"
    },
    {
      title: "Live Event Chat Rooms",
      description: "Real-time, Socket.io-powered chat rooms attached to every event. Complete with pinned messages, slow mode, and moderation tools.",
      icon: ChatCircleDots,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20",
      hoverBorder: "hover:border-secondary/40",
      gradient: "from-secondary/10 to-background"
    },
    {
      title: "QR Check-in & Bulk Messaging",
      description: "Scan tickets at the door with our built-in QR scanner. Need to make an announcement? Send bulk SMS or Emails to all attendees instantly.",
      icon: QrCode,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
      hoverBorder: "hover:border-accent/40",
      gradient: "from-accent/10 to-background"
    },
    {
      title: "Automated Payouts & Teams",
      description: "Seamlessly withdraw funds to your verified bank accounts via Paystack. Plus, invite Co-hosts or Managers to help run your events.",
      icon: Wallet,
      color: "text-foreground",
      bgColor: "bg-foreground/5",
      borderColor: "border-foreground/10",
      hoverBorder: "hover:border-foreground/30",
      gradient: "from-foreground/5 to-background"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Subtle separator line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Tools for the Pro Organizer
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            We've packed EventFi with everything you need to manage your community, run your operations, and handle your finances.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className={`group relative rounded-2xl p-8 lg:p-10 border ${tool.borderColor} ${tool.hoverBorder} transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${tool.gradient} overflow-hidden`}
            >
               {/* Background Decorative Blob */}
               <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${tool.bgColor}`}></div>

               {/* Icon */}
               <div className={`w-14 h-14 rounded-xl ${tool.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                 <tool.icon size={28} weight="fill" className={tool.color} />
               </div>

               {/* Content */}
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-3 text-foreground">
                   {tool.title}
                 </h3>
                 <p className="text-foreground/70 leading-relaxed text-lg">
                   {tool.description}
                 </p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedToolsSection;
