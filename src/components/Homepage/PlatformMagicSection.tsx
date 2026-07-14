"use client";

import React from "react";
import { Sparkle, MagicWand, CreditCard, Clock, CheckCircle } from '@phosphor-icons/react';

const PlatformMagicSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-accent/5 rounded-full blur-3xl -z-10 transform translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-primary/5 rounded-full blur-3xl -z-10 transform -translate-x-1/4"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Sparkle size={16} weight="fill" className="text-accent" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Platform Magic</span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
            Features that feel like the future.
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            We built powerful tools to eliminate friction for both organizers and attendees.
          </p>
        </div>

        <div className="flex flex-col gap-12 lg:gap-20">
          
          {/* Feature 1: AI Generation (Image Left, Content Right) */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="w-full lg:w-1/2 relative">
               <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  
                  {/* Mockup UI */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 bg-background rounded-xl border border-primary/20 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="p-4 border-b border-primary/10 bg-primary/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <MagicWand size={16} weight="fill" className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-1/2 bg-primary/30 rounded mb-1.5"></div>
                        <div className="h-1.5 w-1/3 bg-primary/20 rounded"></div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                       <div className="w-full h-24 bg-foreground/5 rounded-lg border border-dashed border-foreground/20 flex flex-col items-center justify-center gap-2 group-hover:border-primary/40 transition-colors">
                          <span className="text-xs text-foreground/40 font-medium">Drop flyer image or PDF here</span>
                          <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] rounded-md font-bold">GENERATE EVENT</div>
                       </div>
                       <div className="space-y-1.5">
                         <div className="h-1.5 w-full bg-foreground/10 rounded"></div>
                         <div className="h-1.5 w-5/6 bg-foreground/10 rounded"></div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <h3 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                AI-Powered Event Generation
              </h3>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Don't waste time typing out descriptions, dates, and schedules. Simply upload your event flyer (Image or PDF) or write a quick prompt, and our GPT-4 powered engine will build your complete event page in seconds—including extracting a branded color palette.
              </p>
              <ul className="space-y-3">
                {[
                  "Upload Images, PDFs, or DOCX",
                  "Auto-extracts schedule and venue details",
                  "Generates a beautiful, branded color palette",
                  "Ready to publish in under 10 seconds"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80">
                    <CheckCircle size={20} weight="fill" className="text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 2: Installments (Content Left, Image Right) */}
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16">
            <div className="w-full lg:w-1/2 space-y-6">
              <h3 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                Buy Now, Pay Later
              </h3>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Make your premium events accessible to everyone. Enable installment payments on expensive ticket tiers, allowing attendees to secure their spot immediately while paying over time.
              </p>
              <ul className="space-y-3">
                {[
                  "Higher conversion rates on VIP tickets",
                  "Automated payment reminders and tracking",
                  "Flexible max installment limits set by you",
                  "Guaranteed payouts via Paystack integration"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80">
                    <CheckCircle size={20} weight="fill" className="text-secondary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-1/2 relative">
               <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary/10 via-secondary/5 to-background border border-secondary/20 overflow-hidden relative group">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 bg-background rounded-xl border border-secondary/20 shadow-2xl p-5 group-hover:-translate-y-6 transition-transform duration-500 z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-foreground">VIP Access</div>
                      <div className="font-bold text-secondary">₦150,000</div>
                    </div>
                    <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/10 mb-4 flex items-center gap-3">
                      <CreditCard size={24} className="text-secondary" />
                      <div>
                        <div className="text-sm font-bold text-foreground">Split Payment</div>
                        <div className="text-xs text-foreground/60">Pay in 3 installments of ₦50k</div>
                      </div>
                    </div>
                    <div className="h-8 bg-secondary/20 rounded-lg w-full mt-2 relative overflow-hidden flex items-center justify-center">
                       <div className="absolute top-0 left-0 h-full w-1/3 bg-secondary rounded-lg"></div>
                       <span className="text-xs font-bold text-secondary z-10">1 of 3 Paid</span>
                    </div>
                  </div>

                  {/* Decorative background card */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-40 bg-background/50 rounded-xl border border-secondary/10 shadow-lg translate-y-4 scale-95 group-hover:translate-y-8 transition-transform duration-500 blur-sm"></div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PlatformMagicSection;
