"use client";

import React from "react";
import Button from "../Button";
import { ArrowRight2, MessageQuestion } from "iconsax-react";

const FinalCTASection = () => {
  return (
    <section className="py-16 lg:py-24 bg-primary relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-clash-display)] mb-6 text-white leading-tight">
            Ready to Host Your Best Event Yet?
          </h2>

          {/* Subheadline */}
          <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join the organizers who are switching to EventFi for seamless
            ticketing, verified vendors, and unmatched attendee engagement.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA */}
            <Button
              variant="secondary"
              size="lg"
              rightIcon={ArrowRight2}
              iconVariant="Bold"
              onClick={() => {
                window.location.href = "#signup";
              }}
              className="bg-white !text-primary hover:bg-white/90 shadow-lg hover:shadow-xl"
            >
              Start for Free
            </Button>

            {/* Secondary Link */}
            <button
              onClick={() => {
                window.location.href = "#contact-sales";
              }}
              className="flex items-center gap-2 px-6 py-3 text-white hover:text-white/80 font-medium transition-colors duration-200 border-2 border-white/30 hover:border-white/50 rounded-full"
            >
              <MessageQuestion size={20} color="currentColor" variant="Outline" />
              <span>Contact Sales</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;

