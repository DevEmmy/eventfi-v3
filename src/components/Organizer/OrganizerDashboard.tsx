"use client";

import React, { useState, useEffect } from "react";
import DashboardContent from "@/components/Profile/DashboardContent";
import { EventService, OrganizerDashboardData } from "@/services/events";

const OrganizerDashboard = () => {
  const [dashboardData, setDashboardData] = useState<OrganizerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await EventService.getOrganizerDashboard();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="mb-8">
            <div className="h-10 w-64 bg-foreground/10 rounded-lg animate-pulse mb-2" />
            <div className="h-5 w-96 bg-foreground/5 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-background border border-foreground/10 rounded-2xl p-6 h-36 animate-pulse">
                <div className="h-12 w-12 bg-foreground/10 rounded-xl mb-4" />
                <div className="h-8 w-16 bg-foreground/10 rounded mb-1" />
                <div className="h-4 w-24 bg-foreground/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="text-center py-16">
            <p className="text-foreground/60 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
            Organizer Dashboard
          </h1>
          <p className="text-foreground/60">
            Manage your events, track performance, and grow your community
          </p>
        </div>

        {/* Dashboard Content */}
        {dashboardData && <DashboardContent data={dashboardData} />}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
