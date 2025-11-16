"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import {
  ArrowLeft2,
  Calendar,
  Location,
  Clock,
  Ticket,
  User,
  Card,
  Bank,
  Mobile,
  Lock,
  TickCircle,
  DocumentText,
} from "iconsax-react";
import Image from "next/image";

interface EventCheckoutPageProps {
  eventId: string;
}

interface AttendeeInfo {
  name: string;
  email: string;
  phone: string;
}

const EventCheckoutPage: React.FC<EventCheckoutPageProps> = ({ eventId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quantity = parseInt(searchParams.get("qty") || "1");

  const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "mobile">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Initialize attendees array based on quantity
  useEffect(() => {
    setAttendees(
      Array.from({ length: quantity }, () => ({
        name: "",
        email: "",
        phone: "",
      }))
    );
  }, [quantity]);

  // Sample event data - Replace with API call
  const event = {
    id: eventId,
    title: "Tech Fest Lagos 2024",
    date: "March 15, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Lagos Convention Centre",
    address: "Victoria Island, Lagos, Nigeria",
    price: "₦5,000",
    category: "Technology",
    image: undefined,
    organizer: {
      name: "Tech Events Nigeria",
      verified: true,
    },
  };

  const ticketPrice = parseInt(event.price.replace(/[₦,]/g, "")) || 0;
  const subtotal = ticketPrice * quantity;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + serviceFee;

  const handleAttendeeChange = (index: number, field: keyof AttendeeInfo, value: string) => {
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
    // Check if all attendees have required info
    const allAttendeesValid = attendees.every(
      (a) => a.name.trim() && a.email.trim() && a.phone.trim()
    );

    // Check payment method
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
    if (!isFormValid()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to profile page to view tickets
      router.push(`/profile?purchased=${quantity}&event=${eventId}`);
    }, 2000);
  };

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
                  {event.image ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={event.image}
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
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} color="currentColor" variant="Outline" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Location size={16} color="currentColor" variant="Outline" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                            value={attendee.phone}
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

              {/* Payment Method */}
              {ticketPrice > 0 && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-4 text-foreground">
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    {/* Payment Options */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "card"
                            ? "border-primary bg-primary/10"
                            : "border-foreground/20 hover:border-primary/50"
                        }`}
                      >
                        <Card
                          size={24}
                          color="currentColor"
                          variant={paymentMethod === "card" ? "Bold" : "Outline"}
                          className={`mx-auto mb-2 ${
                            paymentMethod === "card" ? "text-primary" : "text-foreground/60"
                          }`}
                        />
                        <p
                          className={`text-sm font-medium ${
                            paymentMethod === "card" ? "text-primary" : "text-foreground/70"
                          }`}
                        >
                          Card
                        </p>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("bank")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "bank"
                            ? "border-primary bg-primary/10"
                            : "border-foreground/20 hover:border-primary/50"
                        }`}
                      >
                        <Bank
                          size={24}
                          color="currentColor"
                          variant={paymentMethod === "bank" ? "Bold" : "Outline"}
                          className={`mx-auto mb-2 ${
                            paymentMethod === "bank" ? "text-primary" : "text-foreground/60"
                          }`}
                        />
                        <p
                          className={`text-sm font-medium ${
                            paymentMethod === "bank" ? "text-primary" : "text-foreground/70"
                          }`}
                        >
                          Bank Transfer
                        </p>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("mobile")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "mobile"
                            ? "border-primary bg-primary/10"
                            : "border-foreground/20 hover:border-primary/50"
                        }`}
                      >
                        <Mobile
                          size={24}
                          color="currentColor"
                          variant={paymentMethod === "mobile" ? "Bold" : "Outline"}
                          className={`mx-auto mb-2 ${
                            paymentMethod === "mobile" ? "text-primary" : "text-foreground/60"
                          }`}
                        />
                        <p
                          className={`text-sm font-medium ${
                            paymentMethod === "mobile" ? "text-primary" : "text-foreground/70"
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
                    {paymentMethod === "bank" && (
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
                    {paymentMethod === "mobile" && (
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
                      </div>
                      <span className="font-semibold text-foreground">
                        {event.price === "Free" ? "Free" : `₦${ticketPrice.toLocaleString()}`}
                      </span>
                    </div>
                    {event.price !== "Free" && (
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
                        {event.price === "Free" ? "Free" : `₦${total.toLocaleString()}`}
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
                    {event.price === "Free" ? "Confirm Tickets" : "Complete Payment"}
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

