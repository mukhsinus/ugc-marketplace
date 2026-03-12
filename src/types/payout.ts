// src/types/payout.ts
export type PayoutStatus =
  | "pending"
  | "approved"
  | "paid"
  | "rejected";

export interface Payout {
  id: string;

  wallet_id: string;
  user_id: string;

  amount: number;
  currency: string;

  method: string;

  status: PayoutStatus;

  external_reference?: string | null;

  created_at: string;
  processed_at?: string | null;
}