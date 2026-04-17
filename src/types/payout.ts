export type PayoutStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'REJECTED'
    | 'CANCELLED';

export interface PayoutAccount {
    id: string;
    organizerId: string;
    bankName: string;
    bankCode: string;
    accountNumber: string; // masked: first 3 + **** + last 3
    accountName: string;
    isVerified: boolean;
    verifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PayoutBalance {
    grossRevenue: number;
    platformFee: number;
    refundsTotal: number;
    previousPayouts: number;
    availableBalance: number;
    currency: string;
    eventId?: string;
}

export interface PayoutRequest {
    id: string;
    organizerId: string;
    eventId: string | null;
    status: PayoutStatus;
    grossRevenue: number;
    platformFee: number;
    refundsTotal: number;
    previousPayouts: number;
    netAmount: number;
    currency: string;
    notes: string | null;
    adminNote: string | null;
    rejectionReason: string | null;
    paymentReference: string | null;
    reviewedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    event?: {
        id: string;
        title: string;
    } | null;
}

export interface PayoutListResponse {
    payouts: PayoutRequest[];
    total: number;
    page: number;
    limit: number;
}

// ── Request payloads ────────────────────────────────────────────────────────

export interface RegisterAccountPayload {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
}

export interface VerifyAccountPayload {
    confirmedName: string;
}

export interface RequestPayoutPayload {
    eventId?: string;
    notes?: string;
}

// ── Nigerian bank list (common ones) ────────────────────────────────────────

export interface NigerianBank {
    code: string;
    name: string;
}

export const NIGERIAN_BANKS: NigerianBank[] = [
    { code: '044', name: 'Access Bank' },
    { code: '023', name: 'Citibank Nigeria' },
    { code: '050', name: 'Ecobank Nigeria' },
    { code: '070', name: 'Fidelity Bank' },
    { code: '011', name: 'First Bank of Nigeria' },
    { code: '214', name: 'First City Monument Bank (FCMB)' },
    { code: '058', name: 'Guaranty Trust Bank (GTB)' },
    { code: '030', name: 'Heritage Bank' },
    { code: '301', name: 'Jaiz Bank' },
    { code: '082', name: 'Keystone Bank' },
    { code: '526', name: 'Moniepoint Microfinance Bank' },
    { code: '076', name: 'Polaris Bank' },
    { code: '101', name: 'Providus Bank' },
    { code: '221', name: 'Stanbic IBTC Bank' },
    { code: '068', name: 'Standard Chartered Bank' },
    { code: '232', name: 'Sterling Bank' },
    { code: '100', name: 'Suntrust Bank' },
    { code: '032', name: 'Union Bank of Nigeria' },
    { code: '033', name: 'United Bank for Africa (UBA)' },
    { code: '215', name: 'Unity Bank' },
    { code: '035', name: 'Wema Bank' },
    { code: '057', name: 'Zenith Bank' },
    { code: '999992', name: 'OPay' },
    { code: '999991', name: 'PalmPay' },
    { code: '50515', name: 'Kuda Microfinance Bank' },
    { code: '090405', name: 'Piggyvest (Piggytech MFB)' },
];
