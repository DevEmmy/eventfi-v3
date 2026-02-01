"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import {
  ArrowLeft2,
  Calendar,
  Location,
  Clock,
  Ticket,
  Card,
  Bank,
  Mobile,
  Lock,
  TickCircle,
} from "iconsax-react";
import Image from "next/image";
import { BookingService } from "@/services/booking";
import { EventService } from "@/services/events";
import customToast from "@/lib/toast";
import { Event } from "@/types/event";
import { BookingOrder, AttendeeInput, PaymentMethod } from "@/types/booking";

interface EventCheckoutPageProps {
  eventId: string;
}

const EventCheckoutPage: React.FC<EventCheckoutPageProps> = ({ eventId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuantity = parseInt(searchParams.get("qty") || "1");
  const initialTicketTypeId = searchParams.get("typeId") || "";

  const [selectedTicketId, setSelectedTicketId] = useState<string>(initialTicketTypeId);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [attendees, setAttendees] = useState<AttendeeInput[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [order, setOrder] = useState<BookingOrder | null>(null);

  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await EventService.getEventById(eventId);
        setEvent(eventData);
        // Auto-select first ticket if none selected and only one exists
        if (!initialTicketTypeId && eventData.tickets.length > 0) {
          setSelectedTicketId(eventData.tickets[0].id || "");
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        customToast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, initialTicketTypeId]);

  // Initialize attendees array based on quantity and selected ticket
  useEffect(() => {
    setAttendees(
      Array.from({ length: quantity }, () => ({
        ticketTypeId: selectedTicketId,
        name: "",
        email: "",
        phone: "",
      }))
    );
  }, [quantity, selectedTicketId]);

  const selectedTicket = useMemo(() => {
    return event?.tickets.find(t => t.id === selectedTicketId);
  }, [event, selectedTicketId]);

  const ticketPrice = selectedTicket ? selectedTicket.price : 0;
  const subtotal = ticketPrice * quantity;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + serviceFee;
  const isFree = total === 0;

  const handleAttendeeChange = (index: number, field: keyof AttendeeInput, value: string) => {
    setAttendees((prev) =>
      prev.map((attendee, i) => (i === index ? { ...attendee, [field]: value } : attendee))
    );
  };

  const handleCardChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const isFormValid = () => {
    const allAttendeesValid = attendees.every((a) => a.name.trim() && a.email.trim() && a.phone?.trim());

    if (isFree) return allAttendeesValid;

    if (paymentMethod === "card") {
      return (
        allAttendeesValid &&
        cardDetails.number.replace(/\s/g, "").length >= 16 &&
        cardDetails.name.trim() &&
        cardDetails.expiry.length === 5 &&
        cardDetails.cvv.length >= 3
      );
    }

    return allAttendeesValid;
  };

  const handleCheckout = async () => {
    if (!isFormValid() || !event || !selectedTicketId) {
      if (!selectedTicketId) {
        customToast.error("Please select a ticket type");
      }
      return;
    }
    setIsProcessing(true);

    try {
      // 1. Initiate Booking if not already created
      let activeOrder = order;
      if (!activeOrder) {
        activeOrder = await BookingService.initiateBooking({
          eventId,
          items: [{ ticketTypeId: selectedTicketId, quantity }],
        });
        setOrder(activeOrder);
      }

      // 2. Update Attendees
      await BookingService.updateAttendees(activeOrder.id, attendees);

      // 3. Process Payment or Confirm Free Order
      if (isFree) {
        await BookingService.confirmFreeOrder(activeOrder.id, attendees);
        customToast.success("Tickets booked successfully!");
        router.push(`/profile?purchased=${quantity}&event=${eventId}`);
      } else {
        const payment = await BookingService.initializePayment(
          activeOrder.id,
          paymentMethod,
          `${window.location.origin}/profile?payment_success=true`
        );
        // Redirect to payment gateway
        window.location.href = payment.paymentUrl;
      }

    } catch (error: any) {
      console.error("Checkout failed:", error);
      customToast.error(error.response?.data?.message || "Failed to process booking");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
            <span>Back to Event</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
              Complete Your Purchase
            </h1>
            <p className="text-foreground/60">
              Review your order and enter your details to secure your tickets
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Summary */}
              <div className="bg-foreground/5 rounded-2xl p-6 border border-foreground/10">
                <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                  Event Summary
                </h2>
                <div className="flex gap-4">
                  {event.coverImage ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Calendar size={32} color="currentColor" variant="Bold" className="text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground mb-2 truncate">
                      {event.title}
                    </h3>
                    <div className="space-y-1 text-sm text-foreground/70">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} color="currentColor" variant="Outline" />
                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} color="currentColor" variant="Outline" />
                        <span>{event.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Location size={16} color="currentColor" variant="Outline" />
                        <span className="truncate">{event.venueName || event.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Selection */}
              <div className="bg-foreground/5 rounded-2xl p-6 border border-foreground/10">
                <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                  Select Tickets
                </h2>
                <div className="space-y-4">
                  {event.tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => {
                        setSelectedTicketId(ticket.id || "");
                        setOrder(null); // Reset order when ticket changes
                      }}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedTicketId === ticket.id
                          ? "border-primary bg-primary/10"
                          : "border-foreground/20 hover:border-primary/50"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTicketId === ticket.id
                              ? "border-primary bg-primary"
                              : "border-foreground/40"
                            }`}>
                            {selectedTicketId === ticket.id && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{ticket.name}</p>
                            {ticket.description && (
                              <p className="text-sm text-foreground/60">{ticket.description}</p>
                            )}
                            <p className="text-xs text-foreground/50">
                              {ticket.remaining !== undefined ? `${ticket.remaining} available` : `${ticket.quantity} total`}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-lg text-primary">
                          {ticket.type === "FREE" ? "Free" : `₦${ticket.price.toLocaleString()}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quantity Selector */}
                {selectedTicket && (
                  <div className="mt-6 pt-6 border-t border-foreground/10">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Quantity</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="w-10 h-10 rounded-full border-2 border-foreground/20 flex items-center justify-center text-foreground/70 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-foreground">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(selectedTicket.maxPerUser || 10, quantity + 1))}
                          disabled={quantity >= (selectedTicket.maxPerUser || 10)}
                          className="w-10 h-10 rounded-full border-2 border-foreground/20 flex items-center justify-center text-foreground/70 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Attendee Information */}
              <div>
                <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                  Attendee Information
                </h2>
                <div className="space-y-6">
                  {attendees.map((attendee, index) => (
                    <div
                      key={index}
                      className="bg-foreground/5 rounded-2xl p-6 border border-foreground/10"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Ticket size={20} color="currentColor" variant="Bold" className="text-primary" />
                        <h3 className="font-semibold text-foreground">
                          Ticket {index + 1}
                        </h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={attendee.name}
                            onChange={(e) =>
                              handleAttendeeChange(index, "name", e.target.value)
                            }
                            placeholder="Enter full name"
                            className="w-full px-4 py-3 rounded-xl border-2 border-foreground/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={attendee.email}
                            onChange={(e) =>
                              handleAttendeeChange(index, "email", e.target.value)
                            }
                            placeholder="email@example.com"
                            className="w-full px-4 py-3 rounded-xl border-2 border-foreground/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={attendee.phone || ""}
                            onChange={(e) =>
                              handleAttendeeChange(index, "phone", e.target.value)
                            }
                            placeholder="+234 800 000 0000"
                            className="w-full px-4 py-3 rounded-xl border-2 border-foreground/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method - Only show if not free */}
              {!isFree && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    {/* Payment Options */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "card"
                          ? "border-primary bg-primary/10"
                          : "border-foreground/20 hover:border-primary/50"
                          }`}
                      >
                        <Card
                          size={24}
                          color="currentColor"
                          variant={paymentMethod === "card" ? "Bold" : "Outline"}
                          className={`mx-auto mb-2 ${paymentMethod === "card" ? "text-primary" : "text-foreground/60"
                            }`}
                        />
                        <p
                          className={`text-sm font-medium ${paymentMethod === "card" ? "text-primary" : "text-foreground/70"
                            }`}
                        >
                          Card
                        </p>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("bank_transfer")}
                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "bank_transfer"
                          ? "border-primary bg-primary/10"
                          : "border-foreground/20 hover:border-primary/50"
                          }`}
                      >
                        <Bank
                          size={24}
                          color="currentColor"
                          variant={paymentMethod === "bank_transfer" ? "Bold" : "Outline"}
                          className={`mx-auto mb-2 ${paymentMethod === "bank_transfer" ? "text-primary" : "text-foreground/60"
                            }`}
                        />
                        <p
                          className={`text-sm font-medium ${paymentMethod === "bank_transfer" ? "text-primary" : "text-foreground/70"
                            }`}
                        >
                          Bank Transfer
                        </p>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("mobile_money")}
                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "mobile_money"
                          ? "border-primary bg-primary/10"
                          : "border-foreground/20 hover:border-primary/50"
                          }`}
                      >
                        <Mobile
                          size={24}
                          color="currentColor"
                          variant={paymentMethod === "mobile_money" ? "Bold" : "Outline"}
                          className={`mx-auto mb-2 ${paymentMethod === "mobile_money" ? "text-primary" : "text-foreground/60"
                            }`}
                        />
                        <p
                          className={`text-sm font-medium ${paymentMethod === "mobile_money" ? "text-primary" : "text-foreground/70"
                            }`}
                        >
                          Mobile Money
                        </p>
                      </button>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === "card" && (
                      <div className="bg-foreground/5 rounded-2xl p-6 border border-foreground/10">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                              Card Number *
                            </label>
                            <input
                              type="text"
                              value={cardDetails.number}
                              onChange={(e) =>
                                handleCardChange(
                                  "number",
                                  formatCardNumber(e.target.value)
                                )
                              }
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className="w-full px-4 py-3 rounded-xl border-2 border-foreground/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                              Cardholder Name *
                            </label>
                            <input
                              type="text"
                              value={cardDetails.name}
                              onChange={(e) =>
                                handleCardChange("name", e.target.value)
                              }
                              placeholder="John Doe"
                              className="w-full px-4 py-3 rounded-xl border-2 border-foreground/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-foreground mb-2">
                                Expiry Date *
                              </label>
                              <input
                                type="text"
                                value={cardDetails.expiry}
                                onChange={(e) =>
                                  handleCardChange(
                                    "expiry",
                                    formatExpiry(e.target.value)
                                  )
                                }
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-foreground mb-2">
                                CVV *
                              </label>
                              <input
                                type="text"
                                value={cardDetails.cvv}
                                onChange={(e) =>
                                  handleCardChange(
                                    "cvv",
                                    e.target.value.replace(/\D/g, "").slice(0, 4)
                                  )
                                }
                                placeholder="123"
                                maxLength={4}
                                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bank Transfer Info */}
                    {paymentMethod === "bank_transfer" && (
                      <div className="bg-foreground/5 rounded-2xl p-6 border border-foreground/10">
                        <p className="text-foreground/70 mb-4">
                          You will receive bank transfer details after completing your order.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-foreground/60">
                            <TickCircle size={16} color="currentColor" variant="Outline" />
                            <span>Bank: Access Bank</span>
                          </div>
                          <div className="flex items-center gap-2 text-foreground/60">
                            <TickCircle size={16} color="currentColor" variant="Outline" />
                            <span>Account details will be sent via email</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mobile Money Info */}
                    {paymentMethod === "mobile_money" && (
                      <div className="bg-foreground/5 rounded-2xl p-6 border border-foreground/10">
                        <p className="text-foreground/70 mb-4">
                          You will receive payment instructions via SMS after completing your order.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-foreground/60">
                            <TickCircle size={16} color="currentColor" variant="Outline" />
                            <span>Supports: MTN, Airtel, Glo, 9mobile</span>
                          </div>
                          <div className="flex items-center gap-2 text-foreground/60">
                            <TickCircle size={16} color="currentColor" variant="Outline" />
                            <span>Payment link will be sent to your phone</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-background border-2 border-foreground/10 rounded-2xl p-6 lg:p-8 shadow-lg">
                  <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-6 text-foreground">
                    Order Summary
                  </h2>

                  {/* Ticket Details */}
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ticket size={20} color="currentColor" variant="Bold" className="text-primary" />
                        <span className="text-foreground/70">
                          {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
                        </span>
                        {selectedTicket && (
                          <span className="text-xs text-foreground/50 border border-foreground/20 px-1 rounded">
                            {selectedTicket.name}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-foreground">
                        {isFree ? "Free" : `₦${ticketPrice.toLocaleString()}`}
                      </span>
                    </div>
                    {!isFree && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground/60">Subtotal</span>
                          <span className="text-foreground/70">
                            ₦{subtotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground/60">Service Fee</span>
                          <span className="text-foreground/70">
                            ₦{serviceFee.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t border-foreground/10 pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        {isFree ? "Free" : `₦${total.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="mb-6 p-4 bg-primary/10 rounded-xl flex items-center gap-3">
                    <Lock size={20} color="currentColor" variant="Bold" className="text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Secure Payment
                      </p>
                      <p className="text-xs text-foreground/60">
                        Your payment information is encrypted
                      </p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleCheckout}
                    disabled={!isFormValid() || isProcessing}
                    isLoading={isProcessing}
                    leftIcon={Lock}
                  >
                    {isFree ? "Confirm Tickets" : "Complete Payment"}
                  </Button>

                  {/* Terms */}
                  <p className="mt-4 text-xs text-center text-foreground/50">
                    By completing this purchase, you agree to our{" "}
                    <a href="#terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCheckoutPage;
