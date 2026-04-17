"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
    Bank,
    Wallet,
    ArrowDown,
    ClockCountdown,
    CheckCircle,
    XCircle,
    Warning,
    CaretRight,
    X,
    SpinnerGap,
    CurrencyNgn,
    Receipt,
    Prohibit,
    ArrowClockwise,
} from "@phosphor-icons/react";
import { PayoutService } from "@/services/payout";
import {
    PayoutAccount,
    PayoutBalance,
    PayoutRequest,
    PayoutStatus,
    NIGERIAN_BANKS,
} from "@/types/payout";
import Button from "@/components/Button";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatNGN(amount: number): string {
    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `₦${amount.toLocaleString("en-NG")}`;
    return `₦${amount.toFixed(2)}`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const STATUS_META: Record<PayoutStatus, { label: string; className: string; Icon: React.ElementType }> = {
    PENDING: { label: "Pending", className: "bg-yellow-500/10 text-yellow-500", Icon: ClockCountdown },
    APPROVED: { label: "Approved", className: "bg-blue-500/10 text-blue-500", Icon: CheckCircle },
    PROCESSING: { label: "Processing", className: "bg-primary/10 text-primary", Icon: SpinnerGap },
    COMPLETED: { label: "Completed", className: "bg-green-500/10 text-green-500", Icon: CheckCircle },
    REJECTED: { label: "Rejected", className: "bg-red-500/10 text-red-500", Icon: XCircle },
    CANCELLED: { label: "Cancelled", className: "bg-foreground/10 text-foreground/50", Icon: Prohibit },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PayoutStatus }) {
    const { label, className, Icon } = STATUS_META[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
            <Icon size={12} weight="fill" />
            {label}
        </span>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

type Step = "overview" | "setup-account" | "verify-account" | "request-payout";

const PayoutPage: React.FC = () => {
    const [step, setStep] = useState<Step>("overview");
    const [account, setAccount] = useState<PayoutAccount | null>(null);
    const [balance, setBalance] = useState<PayoutBalance | null>(null);
    const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
    const [totalPayouts, setTotalPayouts] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Account form
    const [bankName, setBankName] = useState("");
    const [bankCode, setBankCode] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");

    // Verify form
    const [confirmedName, setConfirmedName] = useState("");

    // Request form
    const [notes, setNotes] = useState("");

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [acct, bal, history] = await Promise.all([
                PayoutService.getAccount(),
                PayoutService.getBalance(),
                PayoutService.getMyPayouts(page),
            ]);
            setAccount(acct);
            setBalance(bal);
            setPayouts(history.payouts);
            setTotalPayouts(history.total);
        } catch {
            toast.error("Failed to load payout data");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Pre-fill form when returning to setup
    useEffect(() => {
        if (step === "setup-account" && account) {
            setBankName(account.bankName);
            setBankCode(account.bankCode);
            // Don't pre-fill masked account number or accountName for security
        }
    }, [step, account]);

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleBankSelect = (code: string) => {
        const bank = NIGERIAN_BANKS.find((b) => b.code === code);
        if (bank) {
            setBankCode(bank.code);
            setBankName(bank.name);
        }
    };

    const handleRegisterAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(accountNumber)) {
            toast.error("Account number must be exactly 10 digits");
            return;
        }
        setActionLoading(true);
        try {
            const acct = await PayoutService.registerAccount({ bankName, bankCode, accountNumber, accountName });
            setAccount(acct);
            toast.success("Bank account saved");
            setStep("verify-account");
            setConfirmedName(accountName); // pre-fill
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save account");
        } finally {
            setActionLoading(false);
        }
    };

    const handleVerifyAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const acct = await PayoutService.verifyAccount({ confirmedName });
            setAccount(acct);
            toast.success("Account verified successfully!");
            setStep("overview");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Verification failed — name does not match");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequestPayout = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const payout = await PayoutService.requestPayout({ notes: notes || undefined });
            setPayouts((prev) => [payout, ...prev]);
            setTotalPayouts((n) => n + 1);
            toast.success("Payout request submitted!");
            setStep("overview");
            setNotes("");
            // Refresh balance
            const bal = await PayoutService.getBalance();
            setBalance(bal);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit payout request");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelPayout = async (payoutId: string) => {
        if (!confirm("Cancel this payout request?")) return;
        try {
            await PayoutService.cancelPayout(payoutId);
            setPayouts((prev) =>
                prev.map((p) => (p.id === payoutId ? { ...p, status: "CANCELLED" as PayoutStatus } : p))
            );
            toast.success("Payout request cancelled");
            const bal = await PayoutService.getBalance();
            setBalance(bal);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to cancel request");
        }
    };

    // ── Render states ──────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <SpinnerGap size={40} weight="bold" className="animate-spin text-primary" />
            </div>
        );
    }

    const hasPendingPayout = payouts.some((p) => p.status === "PENDING" || p.status === "APPROVED" || p.status === "PROCESSING");

    // ── Setup Account Form ─────────────────────────────────────────────────────

    if (step === "setup-account") {
        return (
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => setStep("overview")}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-foreground/10 hover:border-primary transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                            {account ? "Update Bank Account" : "Add Bank Account"}
                        </h2>
                        <p className="text-sm text-foreground/60">Your payout destination</p>
                    </div>
                </div>

                <form onSubmit={handleRegisterAccount} className="space-y-5">
                    {/* Bank Select */}
                    <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-1.5">Bank</label>
                        <select
                            value={bankCode}
                            onChange={(e) => handleBankSelect(e.target.value)}
                            required
                            className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="">Select a bank</option>
                            {NIGERIAN_BANKS.map((b) => (
                                <option key={b.code} value={b.code}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-1.5">Account Number</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="10-digit NUBAN"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                            required
                            className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Account Name */}
                    <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                            Account Name <span className="text-foreground/40 font-normal">(as on your bank records)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Full name on account"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            required
                            className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="flex items-start gap-2 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                        <Warning size={18} className="text-yellow-500 shrink-0 mt-0.5" weight="fill" />
                        <p className="text-sm text-foreground/70">
                            Make sure your account name matches your registered bank records exactly. You will be asked to confirm it on the next step.
                        </p>
                    </div>

                    <Button type="submit" variant="primary" fullWidth isLoading={actionLoading}>
                        Save & Continue
                    </Button>
                </form>
            </div>
        );
    }

    // ── Verify Account Form ────────────────────────────────────────────────────

    if (step === "verify-account") {
        return (
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => setStep("setup-account")}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-foreground/10 hover:border-primary transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                            Verify Account
                        </h2>
                        <p className="text-sm text-foreground/60">Confirm the account holder name</p>
                    </div>
                </div>

                <div className="p-4 bg-background border border-foreground/10 rounded-2xl mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Bank size={20} className="text-primary" weight="fill" />
                        </div>
                        <div>
                            <div className="font-semibold text-foreground">{account?.bankName}</div>
                            <div className="text-sm text-foreground/60">{account?.accountNumber}</div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleVerifyAccount} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                            Confirm Account Name
                        </label>
                        <input
                            type="text"
                            placeholder="Type the exact account name"
                            value={confirmedName}
                            onChange={(e) => setConfirmedName(e.target.value)}
                            required
                            className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors"
                        />
                        <p className="text-xs text-foreground/50 mt-1.5">
                            Must match the name on your bank account (case-insensitive)
                        </p>
                    </div>

                    <Button type="submit" variant="primary" fullWidth isLoading={actionLoading}>
                        Verify Account
                    </Button>
                </form>
            </div>
        );
    }

    // ── Request Payout Form ────────────────────────────────────────────────────

    if (step === "request-payout") {
        return (
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => setStep("overview")}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-foreground/10 hover:border-primary transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                            Request Payout
                        </h2>
                        <p className="text-sm text-foreground/60">Withdraw your available balance</p>
                    </div>
                </div>

                {/* Balance Breakdown */}
                {balance && (
                    <div className="bg-background border border-foreground/10 rounded-2xl p-6 mb-6 space-y-3">
                        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-4">Balance Breakdown</h3>
                        <div className="flex justify-between text-sm">
                            <span className="text-foreground/70">Gross Revenue</span>
                            <span className="text-foreground font-medium">{formatNGN(balance.grossRevenue)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-foreground/70">Platform Fee (5%)</span>
                            <span className="text-red-400 font-medium">− {formatNGN(balance.platformFee)}</span>
                        </div>
                        {balance.refundsTotal > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-foreground/70">Refunds</span>
                                <span className="text-red-400 font-medium">− {formatNGN(balance.refundsTotal)}</span>
                            </div>
                        )}
                        {balance.previousPayouts > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-foreground/70">Previous Payouts</span>
                                <span className="text-foreground/50 font-medium">− {formatNGN(balance.previousPayouts)}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-foreground/10 flex justify-between">
                            <span className="font-semibold text-foreground">Available Balance</span>
                            <span className="font-bold text-xl text-primary">{formatNGN(balance.availableBalance)}</span>
                        </div>
                    </div>
                )}

                {/* Destination Account */}
                {account && (
                    <div className="flex items-center gap-3 p-4 bg-background border border-foreground/10 rounded-2xl mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Bank size={20} className="text-green-500" weight="fill" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-foreground">{account.accountName}</div>
                            <div className="text-xs text-foreground/60">{account.bankName} · {account.accountNumber}</div>
                        </div>
                        <CheckCircle size={20} className="text-green-500" weight="fill" />
                    </div>
                )}

                <form onSubmit={handleRequestPayout} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                            Notes <span className="text-foreground/40 font-normal">(optional)</span>
                        </label>
                        <textarea
                            placeholder="Any notes for admin review..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            maxLength={500}
                            className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none"
                        />
                    </div>

                    <div className="flex items-start gap-2 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                        <Receipt size={18} className="text-primary shrink-0 mt-0.5" weight="fill" />
                        <p className="text-sm text-foreground/70">
                            Payouts are reviewed within <strong>1–3 business days</strong>. You will be notified by email at each stage.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={actionLoading}
                        disabled={(balance?.availableBalance ?? 0) < 1000}
                    >
                        Submit Request · {balance ? formatNGN(balance.availableBalance) : "—"}
                    </Button>

                    {(balance?.availableBalance ?? 0) < 1000 && (
                        <p className="text-center text-sm text-red-400">
                            Minimum payout is ₦1,000. Your current balance is below this threshold.
                        </p>
                    )}
                </form>
            </div>
        );
    }

    // ── Overview ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                        Payouts
                    </h1>
                    <p className="text-foreground/60 mt-1">Manage your earnings and withdrawal requests</p>
                </div>
                <button
                    onClick={loadData}
                    className="self-start sm:self-auto flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
                >
                    <ArrowClockwise size={16} />
                    Refresh
                </button>
            </div>

            {/* Balance Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/70 rounded-2xl p-6 text-white">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-4 opacity-80">
                        <Wallet size={18} weight="fill" />
                        <span className="text-sm font-medium">Available Balance</span>
                    </div>
                    <div className="text-4xl font-bold font-[family-name:var(--font-clash-display)] mb-1">
                        {balance ? formatNGN(balance.availableBalance) : "—"}
                    </div>
                    <div className="text-sm opacity-70 mb-6">
                        from {formatNGN(balance?.grossRevenue ?? 0)} gross revenue
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {!account || !account.isVerified ? (
                            <button
                                onClick={() => setStep("setup-account")}
                                className="flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
                            >
                                <Bank size={16} weight="fill" />
                                {account ? "Verify Account" : "Add Bank Account"}
                            </button>
                        ) : hasPendingPayout ? (
                            <div className="flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm">
                                <ClockCountdown size={16} weight="fill" />
                                Payout in Progress
                            </div>
                        ) : (
                            <button
                                onClick={() => setStep("request-payout")}
                                disabled={(balance?.availableBalance ?? 0) < 1000}
                                className="flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ArrowDown size={16} weight="bold" />
                                Request Payout
                            </button>
                        )}

                        <button
                            onClick={() => setStep(account && !account.isVerified ? "verify-account" : "setup-account")}
                            className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm hover:bg-white/20 transition-colors"
                        >
                            <Bank size={16} weight="fill" />
                            {account ? "Update Account" : "Setup Account"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Balance Breakdown (condensed) */}
            {balance && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Gross Revenue", value: balance.grossRevenue, color: "text-foreground" },
                        { label: "Platform Fee", value: balance.platformFee, color: "text-red-400" },
                        { label: "Refunds", value: balance.refundsTotal, color: "text-red-400" },
                        { label: "Paid Out", value: balance.previousPayouts, color: "text-foreground/50" },
                    ].map((item) => (
                        <div key={item.label} className="bg-background border border-foreground/10 rounded-2xl p-4">
                            <div className="text-xs text-foreground/50 mb-1">{item.label}</div>
                            <div className={`font-bold text-lg ${item.color}`}>{formatNGN(item.value)}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bank Account Status */}
            <div className="bg-background border border-foreground/10 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${account?.isVerified ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                            <Bank size={20} weight="fill" className={account?.isVerified ? "text-green-500" : "text-yellow-500"} />
                        </div>
                        <div>
                            {account ? (
                                <>
                                    <div className="font-semibold text-foreground">{account.accountName}</div>
                                    <div className="text-sm text-foreground/60">{account.bankName} · {account.accountNumber}</div>
                                </>
                            ) : (
                                <>
                                    <div className="font-semibold text-foreground">No bank account</div>
                                    <div className="text-sm text-foreground/60">Add an account to receive payouts</div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {account && (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${account.isVerified ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                                {account.isVerified ? "Verified" : "Unverified"}
                            </span>
                        )}
                        <button
                            onClick={() => setStep("setup-account")}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                            {account ? "Edit" : "Add"}
                            <CaretRight size={14} />
                        </button>
                    </div>
                </div>

                {account && !account.isVerified && (
                    <div className="mt-4 pt-4 border-t border-foreground/10 flex items-start gap-2">
                        <Warning size={16} className="text-yellow-500 shrink-0 mt-0.5" weight="fill" />
                        <div className="flex-1 flex items-center justify-between">
                            <p className="text-sm text-foreground/70">
                                Verify your account name to enable payouts
                            </p>
                            <button
                                onClick={() => setStep("verify-account")}
                                className="text-sm text-primary font-medium hover:underline ml-4"
                            >
                                Verify Now
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Payout History */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-clash-display)] text-foreground">
                        Payout History
                    </h3>
                    {totalPayouts > 0 && (
                        <span className="text-sm text-foreground/50">{totalPayouts} total</span>
                    )}
                </div>

                {payouts.length === 0 ? (
                    <div className="bg-background border border-foreground/10 rounded-2xl p-12 text-center">
                        <CurrencyNgn size={48} weight="light" className="text-foreground/20 mx-auto mb-3" />
                        <p className="text-foreground/60 mb-2">No payout requests yet</p>
                        <p className="text-sm text-foreground/40">
                            {account?.isVerified
                                ? "Request a payout when you have available balance"
                                : "Set up and verify your bank account to get started"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {payouts.map((payout) => (
                            <div
                                key={payout.id}
                                className="bg-background border border-foreground/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                        <span className="font-bold text-foreground text-lg">
                                            {formatNGN(payout.netAmount)}
                                        </span>
                                        <StatusBadge status={payout.status} />
                                    </div>
                                    <div className="text-sm text-foreground/60">
                                        Requested {formatDate(payout.createdAt)}
                                        {payout.event && (
                                            <span className="ml-2 text-foreground/40">· {payout.event.title}</span>
                                        )}
                                    </div>
                                    {(payout.rejectionReason || payout.adminNote) && (
                                        <div className="mt-2 text-sm text-foreground/60 italic">
                                            "{payout.rejectionReason || payout.adminNote}"
                                        </div>
                                    )}
                                    {payout.paymentReference && (
                                        <div className="mt-1 text-xs text-foreground/50">
                                            Ref: {payout.paymentReference}
                                        </div>
                                    )}
                                </div>

                                {payout.status === "PENDING" && (
                                    <button
                                        onClick={() => handleCancelPayout(payout.id)}
                                        className="self-start sm:self-auto flex items-center gap-1.5 text-sm text-red-400 hover:text-red-500 border border-red-400/30 hover:border-red-400 px-3 py-2 rounded-xl transition-colors"
                                    >
                                        <X size={14} />
                                        Cancel
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPayouts > 10 && (
                            <div className="flex items-center justify-center gap-3 pt-4">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-sm border border-foreground/10 rounded-xl hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-foreground/60">
                                    Page {page} of {Math.ceil(totalPayouts / 10)}
                                </span>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page >= Math.ceil(totalPayouts / 10)}
                                    className="px-4 py-2 text-sm border border-foreground/10 rounded-xl hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayoutPage;
