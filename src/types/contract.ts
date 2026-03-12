// src/types/contract.ts
export type ContractStatus =
  | "active"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Contract {
  id: string;

  job_id: string;

  brand_id: string;
  creator_id: string;

  amount: number;
  currency: string;

  status: ContractStatus;

  created_at: string;
  updated_at: string;
}