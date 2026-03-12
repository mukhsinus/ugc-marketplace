// src/types/proposal.ts
export type ProposalStatus =
  | "pending"
  | "accepted"
  | "rejected";

export interface Proposal {
  id: string;

  job_id: string;
  creator_id: string;

  message?: string | null;
  price_offer?: number | null;
  delivery_time?: number | null;

  status: ProposalStatus;

  created_at: string;
  updated_at: string;
}