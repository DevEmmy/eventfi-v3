import axiosInstance from "@/lib/axios";
import {
    PayoutAccount,
    PayoutBalance,
    PayoutRequest,
    PayoutListResponse,
    RegisterAccountPayload,
    VerifyAccountPayload,
    RequestPayoutPayload,
} from "@/types/payout";

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

export const PayoutService = {
    /**
     * Get the organizer's registered bank account (masked)
     */
    getAccount: async (): Promise<PayoutAccount | null> => {
        try {
            const res = await axiosInstance.get<ApiResponse<{ account: PayoutAccount | null }>>(
                "/payouts/account"
            );
            return res.data.data.account;
        } catch (err: any) {
            if (err.response?.status === 404) return null;
            throw err;
        }
    },

    /**
     * Register or update bank account details
     */
    registerAccount: async (payload: RegisterAccountPayload): Promise<PayoutAccount> => {
        const res = await axiosInstance.post<ApiResponse<{ account: PayoutAccount }>>(
            "/payouts/account",
            payload
        );
        return res.data.data.account;
    },

    /**
     * Confirm the account name to mark account as verified
     */
    verifyAccount: async (payload: VerifyAccountPayload): Promise<PayoutAccount> => {
        const res = await axiosInstance.post<ApiResponse<{ account: PayoutAccount }>>(
            "/payouts/account/verify",
            payload
        );
        return res.data.data.account;
    },

    /**
     * Get available balance (optionally scoped to a single event)
     */
    getBalance: async (eventId?: string): Promise<PayoutBalance> => {
        const params = eventId ? { eventId } : {};
        const res = await axiosInstance.get<ApiResponse<{ balance: PayoutBalance }>>(
            "/payouts/balance",
            { params }
        );
        return res.data.data.balance;
    },

    /**
     * Submit a payout request
     */
    requestPayout: async (payload: RequestPayoutPayload): Promise<PayoutRequest> => {
        const res = await axiosInstance.post<ApiResponse<{ payout: PayoutRequest }>>(
            "/payouts/request",
            payload
        );
        return res.data.data.payout;
    },

    /**
     * Cancel a pending payout request
     */
    cancelPayout: async (payoutId: string): Promise<void> => {
        await axiosInstance.delete(`/payouts/${payoutId}`);
    },

    /**
     * Get organizer's payout history (paginated)
     */
    getMyPayouts: async (page = 1, limit = 10): Promise<PayoutListResponse> => {
        const res = await axiosInstance.get<ApiResponse<PayoutListResponse>>(
            "/payouts/my",
            { params: { page, limit } }
        );
        return res.data.data;
    },
};
