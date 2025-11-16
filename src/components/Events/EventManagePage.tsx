"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import {
  ArrowLeft2,
  Calendar,
  Location,
  Clock,
  People,
  Ticket,
  MoneyRecive,
  Chart,
  Edit2,
  Trash,
  Share,
  Copy,
  More,
  ArrowUp2,
  ArrowDown2,
  User,
  Sms,
  Call,
  Export,
  Eye,
} from "iconsax-react";

interface EventManagePageProps {
  eventId: string;
}

const EventManagePage: React.FC<EventManagePageProps> = ({ eventId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "attendees" | "analytics">("overview");

  // Mock event data - Replace with API call
  const event = {
    id: eventId,
    title: "Tech Fest Lagos 2024",
    date: "March 15, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Lagos Convention Centre",
    address: "Victoria Island, Lagos, Nigeria",
    category: "Technology",
    image: undefined,
    status: "published" as "draft" | "published" | "cancelled" | "completed",
    createdAt: "Jan 10, 2024",
  };

  // Mock statistics
  const stats = {
    totalTickets: 1000,
    ticketsSold: 750,
    ticketsRemaining: 250,
    totalRevenue: 3750000,
    averageTicketPrice: 5000,
    attendanceRate: 87,
    checkIns: 653,
    noShows: 97,
    refunds: 12,
    revenueChange: 15.3,
    salesChange: 8.7,
  };

  // Mock ticket types breakdown
  const ticketTypes = [
    {
      name: "General Admission",
      price: 5000,
      total: 500,
      sold: 400,
      revenue: 2000000,
    },
    {
      name: "VIP",
      price: 15000,
      total: 200,
      sold: 180,
      revenue: 2700000,
    },
    {
      name: "Early Bird",
      price: 3000,
      total: 300,
      sold: 170,
      revenue: 510000,
    },
  ];

  // Mock sales over time data
  const salesData = [
    { date: "Jan 10", sales: 50, revenue: 250000 },
    { date: "Jan 15", sales: 120, revenue: 600000 },
    { date: "Jan 20", sales: 200, revenue: 1000000 },
    { date: "Jan 25", sales: 280, revenue: 1400000 },
    { date: "Feb 1", sales: 350, revenue: 1750000 },
    { date: "Feb 5", sales: 450, revenue: 2250000 },
    { date: "Feb 10", sales: 550, revenue: 2750000 },
    { date: "Feb 15", sales: 650, revenue: 3250000 },
    { date: "Mar 1", sales: 720, revenue: 3600000 },
    { date: "Mar 10", sales: 750, revenue: 3750000 },
  ];

  // Mock attendees list
  const attendees = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+234 800 111 2222",
      ticketType: "VIP",
      ticketPrice: 15000,
      purchaseDate: "Jan 15, 2024",
      status: "checked_in",
      checkInTime: "10:15 AM",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+234 800 222 3333",
      ticketType: "General Admission",
      ticketPrice: 5000,
      purchaseDate: "Jan 20, 2024",
      status: "checked_in",
      checkInTime: "10:30 AM",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+234 800 333 4444",
      ticketType: "Early Bird",
      ticketPrice: 3000,
      purchaseDate: "Jan 25, 2024",
      status: "not_checked_in",
      checkInTime: null,
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+234 800 444 5555",
      ticketType: "General Admission",
      ticketPrice: 5000,
      purchaseDate: "Feb 1, 2024",
      status: "checked_in",
      checkInTime: "11:00 AM",
    },
  ];

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Eye },
    { id: "attendees" as const, label: "Attendees", icon: People, count: attendees.length },
    { id: "analytics" as const, label: "Analytics", icon: Chart },
  ];

  const handleEdit = () => {
    router.push(`/events/${eventId}/edit`);
  };

  const handleDuplicate = () => {
    console.log("Duplicate event");
    alert("Event duplicated! Redirecting to edit page...");
    router.push("/events/create");
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this event? This action cannot be undone.")) {
      console.log("Cancel event");
      alert("Event cancelled");
    }
  };

  const handleExport = () => {
    console.log("Export attendees");
    alert("Exporting attendees list...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
            >
              <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={Share}
                onClick={() => router.push(`/events/${eventId}`)}
              >
                View Public Page
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={Edit2}
                onClick={handleEdit}
              >
                Edit Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            {event.image ? (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Calendar size={48} color="currentColor" variant="Bold" className="text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                  {event.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === "published"
                      ? "bg-green-500/10 text-green-500"
                      : event.status === "draft"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : event.status === "cancelled"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} color="currentColor" variant="Outline" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} color="currentColor" variant="Outline" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Location size={16} color="currentColor" variant="Outline" />
                  <span>{event.location}</span>
                </div>
              </div>
              <p className="text-sm text-foreground/60">
                Created on {event.createdAt}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-background border border-foreground/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground mb-1">
                {stats.ticketsSold}
              </div>
              <div className="text-xs text-foreground/60">Tickets Sold</div>
            </div>
            <div className="bg-background border border-foreground/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground mb-1">
                ₦{(stats.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-foreground/60">Revenue</div>
            </div>
            <div className="bg-background border border-foreground/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground mb-1">
                {stats.checkIns}
              </div>
              <div className="text-xs text-foreground/60">Check-ins</div>
            </div>
            <div className="bg-background border border-foreground/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground mb-1">
                {stats.attendanceRate}%
              </div>
              <div className="text-xs text-foreground/60">Attendance</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-foreground/10">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  <TabIcon
                    size={18}
                    color="currentColor"
                    variant={activeTab === tab.id ? "Bold" : "Outline"}
                  />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary"
                          : "bg-foreground/5 text-foreground/60"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Main Stats */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Tickets Overview */}
                <div className="lg:col-span-2 bg-background border border-foreground/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                    Ticket Sales
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground/70">Tickets Sold</span>
                        <span className="font-bold text-foreground">
                          {stats.ticketsSold} / {stats.totalTickets}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-foreground/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{
                            width: `${(stats.ticketsSold / stats.totalTickets) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-foreground/60">
                        <span>{stats.ticketsRemaining} remaining</span>
                        <span>{Math.round((stats.ticketsSold / stats.totalTickets) * 100)}% sold</span>
                      </div>
                    </div>

                    {/* Ticket Types Breakdown */}
                    <div className="pt-4 border-t border-foreground/10">
                      <h4 className="font-semibold text-foreground mb-3">By Ticket Type</h4>
                      <div className="space-y-3">
                        {ticketTypes.map((type, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-foreground/70">{type.name}</span>
                              <span className="text-sm font-semibold text-foreground">
                                {type.sold} / {type.total}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full"
                                style={{
                                  width: `${(type.sold / type.total) * 100}%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1 text-xs text-foreground/60">
                              <span>₦{type.price.toLocaleString()}</span>
                              <span>₦{type.revenue.toLocaleString()} revenue</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                    Revenue
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">
                        ₦{stats.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-foreground/60">Total Revenue</div>
                      <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
                        <ArrowUp2 size={16} color="currentColor" variant="Bold" />
                        <span>+{stats.revenueChange}% vs last event</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-foreground/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground/70">Avg. Ticket Price</span>
                        <span className="font-semibold text-foreground">
                          ₦{stats.averageTicketPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground/70">Refunds</span>
                        <span className="font-semibold text-foreground">{stats.refunds}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Stats */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <People size={24} color="currentColor" variant="Bold" className="text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stats.checkIns}</div>
                      <div className="text-sm text-foreground/60">Checked In</div>
                    </div>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {stats.attendanceRate}% attendance rate
                  </div>
                </div>

                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <User size={24} color="currentColor" variant="Bold" className="text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stats.noShows}</div>
                      <div className="text-sm text-foreground/60">No Shows</div>
                    </div>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {Math.round((stats.noShows / stats.ticketsSold) * 100)}% of sold tickets
                  </div>
                </div>

                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <MoneyRecive size={24} color="currentColor" variant="Bold" className="text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stats.refunds}</div>
                      <div className="text-sm text-foreground/60">Refunds</div>
                    </div>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {Math.round((stats.refunds / stats.ticketsSold) * 100)}% refund rate
                  </div>
                </div>
              </div>

              {/* Management Actions */}
              <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                  Event Actions
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={Edit2}
                    onClick={handleEdit}
                  >
                    Edit Event
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={Copy}
                    onClick={handleDuplicate}
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={Share}
                    onClick={() => router.push(`/events/${eventId}`)}
                  >
                    View Public
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={Trash}
                    onClick={handleCancel}
                    className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                  >
                    Cancel Event
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendees" && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                    Attendees List
                  </h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    {attendees.length} total attendees
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Export}
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search attendees..."
                      className="pl-10 pr-4 py-2 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                    <User
                      size={18}
                      color="currentColor"
                      variant="Outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                    />
                  </div>
                </div>
              </div>

              {/* Attendees Table */}
              <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-foreground/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Ticket Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Purchase Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                      {attendees.map((attendee) => (
                        <tr key={attendee.id} className="hover:bg-foreground/5 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-foreground">{attendee.name}</div>
                              <div className="text-sm text-foreground/60">{attendee.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {attendee.ticketType}
                              </div>
                              <div className="text-xs text-foreground/60">
                                ₦{attendee.ticketPrice.toLocaleString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground/70">
                            {attendee.purchaseDate}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                attendee.status === "checked_in"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }`}
                            >
                              {attendee.status === "checked_in" ? "Checked In" : "Not Checked In"}
                            </span>
                            {attendee.checkInTime && (
                              <div className="text-xs text-foreground/60 mt-1">
                                {attendee.checkInTime}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${attendee.email}`}
                                className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                                title="Send Email"
                              >
                                <Sms size={18} color="currentColor" variant="Outline" />
                              </a>
                              <a
                                href={`tel:${attendee.phone}`}
                                className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                                title="Call"
                              >
                                <Call size={18} color="currentColor" variant="Outline" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8">
              {/* Sales Chart */}
              <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                    Sales Over Time
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-foreground/70">Tickets Sold</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <span className="text-foreground/70">Revenue</span>
                    </div>
                  </div>
                </div>
                {/* Simple bar chart representation */}
                <div className="h-64 flex items-end justify-between gap-2">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-primary rounded-t"
                          style={{
                            height: `${(data.sales / 800) * 200}px`,
                          }}
                        />
                        <div
                          className="w-full bg-secondary/50 rounded-t"
                          style={{
                            height: `${(data.revenue / 4000000) * 200}px`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-foreground/60 rotate-45 origin-top-left">
                        {data.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Peak Sales Day</div>
                  <div className="text-2xl font-bold text-foreground mb-1">Mar 10</div>
                  <div className="text-sm text-foreground/60">120 tickets sold</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Conversion Rate</div>
                  <div className="text-2xl font-bold text-foreground mb-1">12.5%</div>
                  <div className="text-sm text-foreground/60">Page views to sales</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Avg. Time to Purchase</div>
                  <div className="text-2xl font-bold text-foreground mb-1">3.2 days</div>
                  <div className="text-sm text-foreground/60">From first view</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Top Referral Source</div>
                  <div className="text-2xl font-bold text-foreground mb-1">Social Media</div>
                  <div className="text-sm text-foreground/60">45% of sales</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Repeat Attendees</div>
                  <div className="text-2xl font-bold text-foreground mb-1">34%</div>
                  <div className="text-sm text-foreground/60">From previous events</div>
                </div>
                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                  <div className="text-sm text-foreground/60 mb-2">Check-in Rate</div>
                  <div className="text-2xl font-bold text-foreground mb-1">87%</div>
                  <div className="text-sm text-foreground/60">
                    {stats.checkIns} of {stats.ticketsSold} checked in
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventManagePage;

