// src/types/job.ts
export type JobStatus =
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Job {
  id: string;

  title: string;
  description?: string;

  brand_id: string;

  budget_min?: number | null;
  budget_max?: number | null;

  content_type?: string | null;
  platform?: string | null;

  videos_required?: number | null;

  deadline?: string | null;

  status: JobStatus;

  created_at: string;
  updated_at: string;
}