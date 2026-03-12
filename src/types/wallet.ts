// src/types/wallet.ts
export interface Wallet {
  id: string;

  user_id: string;

  balance: number;

  currency: string;

  created_at: string;
  updated_at: string;
}


export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed";

export type TransactionType =
  | "deposit"
  | "escrow_hold"
  | "escrow_release"
  | "withdraw_request"
  | "payout"
  | "payout_refund";

export interface Transaction {
  id: string;

  wallet_id: string;

  contract_id?: string | null;

  type: TransactionType;

  amount: number;

  currency: string;

  status: TransactionStatus;

  description?: string | null;

  created_at: string;
  updated_at: string;
}