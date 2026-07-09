"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CalendarBlank, CheckCircle, Clock, Wallet } from '@phosphor-icons/react';
import Button from "@/components/Button";
import { BookingService } from "@/services/booking";
import customToast from "@/lib/toast";
import { BookingOrder, InstallmentPaymentSchedule } from "@/types/booking";

interface PaymentPlansProps {
  orders: BookingOrder[];
  loading: boolean;
}

const statusBadge: Record<InstallmentPaymentSchedule["status"], { label: string; className: string }> = {
  pending: { label: "Upcoming", className: "bg-foreground/10 text-foreground/60" },
  paid: { label: "Paid", className: "bg-green-500/10 text-green-600" },
  overdue: { label: "Overdue", className: "bg-red-500/10 text-red-500" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-500" },
};

const planStatusBadge: Record<string, { label: string; className: string }> = {
  active: { label: "In progress", className: "bg-primary/10 text-primary" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-600" },
  defaulted: { label: "Cancelled (missed payment)", className: "bg-red-500/10 text-red-500" },
  cancelled: { label: "Cancelled", className: "bg-foreground/10 text-foreground/60" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const OrderCard: React.FC<{ order: BookingOrder; onPaid: () => void }> = ({ order, onPaid }) => {
  const [payingId, setPayingId] = useState<string | null>(null);
  const plan = order.installmentPlan!;
  const isActive = plan.status === "active";
  const nextPayable = isActive
    ? plan.payments.find((p) => p.status === "pending" || p.status === "overdue" || p.status === "failed")
    : undefined;

  const handlePay = async (installmentId: string) => {
    setPayingId(installmentId);
    try {
      const result = await BookingService.payInstallment(
        order.id,
        installmentId,
        `${window.location.origin}/profile?tab=payments&payment_success=true`
      );
      window.location.href = result.paymentUrl;
    } catch (error: any) {
      customToast.error(error.response?.data?.message || "Failed to start payment");
      setPayingId(null);
    }
  };

  return (
    <div className="bg-background border border-foreground/10 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-5">
        {order.event.coverImage ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <Image src={order.event.coverImage} alt={order.event.title} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <CalendarBlank size={24} color="currentColor" weight="fill" className="text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-foreground truncate">{order.event.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${planStatusBadge[plan.status]?.className}`}>
              {planStatusBadge[plan.status]?.label}
            </span>
          </div>
          <p className="text-sm text-foreground/50">
            {new Date(order.event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {plan.payments.map((payment) => {
          const badge = statusBadge[payment.status];
          const canPay = isActive && (payment.status === "pending" || payment.status === "overdue" || payment.status === "failed");
          return (
            <div
              key={payment.id}
              className="flex items-center justify-between gap-3 py-3 px-4 bg-foreground/5 rounded-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-background border border-foreground/10 flex items-center justify-center shrink-0 text-xs font-semibold text-foreground/70">
                  {payment.sequence}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {order.currency} {payment.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {payment.status === "paid" && payment.paidAt
                      ? `Paid ${formatDate(payment.paidAt)}`
                      : `Due ${formatDate(payment.dueDate)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                  {badge.label}
                </span>
                {canPay && payment.id === nextPayable?.id && (
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={payingId === payment.id}
                    disabled={payingId !== null}
                    onClick={() => handlePay(payment.id)}
                  >
                    Pay now
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PaymentPlans: React.FC<PaymentPlansProps> = ({ orders, loading }) => {
  const refresh = () => window.location.reload();

  const active = orders.filter((o) => o.installmentPlan?.status === "active");
  const past = orders.filter((o) => o.installmentPlan && o.installmentPlan.status !== "active");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-background border border-foreground/10 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
          <Wallet size={40} color="currentColor" weight="regular" className="text-foreground/40" />
        </div>
        <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] mb-2 text-foreground">
          No Payment Plans
        </h3>
        <p className="text-foreground/60 max-w-md mx-auto">
          Tickets you buy in installments will show up here with their payment schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {active.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={22} color="currentColor" weight="fill" className="text-primary" />
            <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
              Active Plans
            </h3>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {active.length}
            </span>
          </div>
          <div className="space-y-4">
            {active.map((order) => (
              <OrderCard key={order.id} order={order} onPaid={refresh} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={22} color="currentColor" weight="regular" className="text-foreground/60" />
            <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground/60">
              Past Plans
            </h3>
            <span className="px-3 py-1 bg-foreground/5 text-foreground/60 rounded-full text-sm font-medium">
              {past.length}
            </span>
          </div>
          <div className="space-y-4 opacity-75">
            {past.map((order) => (
              <OrderCard key={order.id} order={order} onPaid={refresh} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPlans;
