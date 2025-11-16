"use client";

import { useState, useEffect } from "react";
import { HambergerMenu, CloseCircle, CalendarAdd, Login } from "iconsax-react";
import NotificationCenter from "@/components/Notifications/NotificationCenter";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "Explore Events", href: "/explore-events" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Community", href: "/community" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full duration-300 ${
          isScrolled
            ? " bg-background/95 backdrop-blur-sm"
            : "bg-background"
        }`}
        role="banner"
      >
        <nav
          className="container mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="shrink-0">
              <a
                href="/"
                className="text-2xl md:text-3xl font-bold  text-primary hover:text-primary/90 transition-colors"
                aria-label="EventFi Home"
              >
                <h1>EventFi</h1>
              </a>
            </div>

            {/* Desktop Navigation Links - Center */}
            <div className="hidden lg:flex items-center justify-center flex-1 space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200 text-sm md:text-base"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop Actions - Right */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Notification Center */}
              <NotificationCenter userRole="dual" />
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all duration-200 "
                aria-label="Create Event"
              >
                <CalendarAdd size={20} color="currentColor" variant="Bold" />
                <span>Create Event</span>
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-foreground/20 text-foreground rounded-full font-medium hover:border-primary hover:text-primary transition-all duration-200"
                aria-label="Sign In"
              >
                <Login size={20} color="currentColor" variant="Outline" />
                <span>Sign In</span>
              </button>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <HambergerMenu size={28} color="currentColor" variant="Outline" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-background transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div className="flex flex-col h-full">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-6 border-b border-foreground/10">
              <h2 className="text-xl font-bold  text-primary">
                EventFi
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Close mobile menu"
              >
                <CloseCircle size={28} color="currentColor" variant="Outline" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-6 py-8" aria-label="Mobile navigation">
              <ul className="space-y-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Actions */}
            <div className="p-6 border-t border-foreground/10 space-y-4">
              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all duration-200 "
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Create Event"
              >
                <CalendarAdd size={20} color="currentColor" variant="Bold" />
                <span>Create Event</span>
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-foreground/20 text-foreground rounded-full font-medium hover:border-primary hover:text-primary transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Sign In"
              >
                <Login size={20} color="currentColor" variant="Outline" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

