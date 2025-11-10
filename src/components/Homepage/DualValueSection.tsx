"use client";

import React from "react";
import Button from "../Button";
import { CalendarAdd, Location, ArrowRight } from "iconsax-react";

const DualValueSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1 - For Organizers */}
          <div
            className="group relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden"
            onClick={() => {
              window.location.href = "#host-event";
            }}
          >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl -z-10"></div>

            {/* Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                <CalendarAdd
                  size={32}
                  color="currentColor"
                  variant="Bold"
                  className="text-primary"
                />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                Planning an Event?
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Handle ticketing, book vendors, and engage your audience—all in
                one dashboard.
              </p>

              {/* Button */}
              <Button
                variant="primary"
                size="lg"
                rightIcon={ArrowRight}
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = "#host-event";
                }}
                className="group-hover:scale-105 transition-transform duration-300"
              >
                Host an Event
              </Button>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 rounded-2xl -z-0"></div>
          </div>

          {/* Card 2 - For Attendees */}
          <div
            className="group relative bg-gradient-to-br from-secondary/5 via-secondary/10 to-secondary/5 rounded-2xl p-8 lg:p-12 border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden"
            onClick={() => {
              window.location.href = "#explore-events";
            }}
          >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-2xl -z-10"></div>

            {/* Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors duration-300">
                <Location
                  size={32}
                  color="currentColor"
                  variant="Bold"
                  className="text-secondary"
                />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground group-hover:text-secondary transition-colors duration-300">
                Looking for Fun?
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Discover unique experiences, buy tickets easily, and earn
                rewards while you attend.
              </p>

              {/* Button */}
              <Button
                variant="secondary"
                size="lg"
                rightIcon={ArrowRight}
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = "#explore-events";
                }}
                className="group-hover:scale-105 transition-transform duration-300"
              >
                Explore Events
              </Button>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors duration-300 rounded-2xl -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualValueSection;

