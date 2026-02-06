"use client";

import React, { useState } from "react";
import {
  Instagram,
  MessageText1,
  ArrowRight2,
  Share,
  Link,
} from "iconsax-react";
import Button from "./Button";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Handle subscription logic here
      console.log("Subscribed:", email);
      setEmail("");
      // You can add a toast notification here
    }
  };

  return (
    <footer className="bg-background border-t border-foreground/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-primary mb-2">EventFi</h3>
              <p className="text-sm text-foreground/70 leading-relaxed mb-6">
                The all-in-one platform for seamless events, trusted vendors,
                and live engagement.
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/theEventfi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200"
                aria-label="Twitter"
              >
                <Share size={20} color="currentColor" variant="Outline" />
              </a>
              {/* <a
                href="https://instagram.com/eventfi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} color="currentColor" variant="Outline" />
              </a> */}
              {/* <a
                href="https://linkedin.com/company/eventfi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Link size={20} color="currentColor" variant="Outline" />
              </a> */}
              {/* <a
                href="https://discord.gg/eventfi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200"
                aria-label="Discord"
              >
                <MessageText1 size={20} color="currentColor" variant="Outline" />
              </a> */}
            </div>
          </div>

          {/* Column 2: For Organizers */}
          <div>
            <h4 className="text-lg font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              For Organizers
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/events/create"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Create an Event
                </a>
              </li>
              {/* <li>
                <a
                  href="#marketplace"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Vendor Marketplace
                </a>
              </li> */}
              <li>
                <a
                  href="/explore-events"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Ticketing Features
                </a>
              </li>
              {/* <li>
                <a
                  href="#engagement"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Engagement Tools
                </a>
              </li> */}
              {/* <li>
                <a
                  href="#pricing"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Pricing / Fees
                </a>
              </li> */}
            </ul>
          </div>

          {/* Column 3: For Attendees */}
          <div>
            <h4 className="text-lg font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              For Attendees
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/explore-events"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Explore Events
                </a>
              </li>
              <li>
                <a
                  href="/profile/#my-tickets"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Access My Tickets
                </a>
              </li>
              {/* <li>
                <a
                  href="#support"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Help Center / Support
                </a>
              </li> */}
              <li>
                <a
                  href="#download-app"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Download App
                  <span className="ml-2 text-xs text-foreground/50">
                    (Coming Soon)
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-lg font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Blog / News (coming soon)
                </a>
              </li>
              {/* <li>
                <a
                  href="mailto:careers@eventfi.com"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Careers
                </a>
              </li> */}
              <li>
                <a
                  href="mailto:ev3ntfi@gmail.com"
                  className="text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter/Updates */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
              Stay in the loop
            </h4>
            <p className="text-sm text-foreground/70 mb-4">
              Get updates on new features, events, and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                rightIcon={ArrowRight2}
                iconVariant="Bold"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-foreground/10 bg-foreground/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/60">
              © {new Date().getFullYear()} EventFi. All rights reserved.
            </p>
            {/* <div className="flex flex-wrap items-center gap-6 text-sm">
              <a
                href="#privacy"
                className="text-foreground/60 hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-foreground/60 hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="text-foreground/60 hover:text-primary transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

