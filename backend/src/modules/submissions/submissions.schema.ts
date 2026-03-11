// backend/src/modules/submissions/submissions.schema.ts
import { z } from "zod";

export const createSubmissionSchema = z.object({
  job_id: z.string().uuid(),
  file_url: z.string().url(),
});

export const updateSubmissionSchema = z.object({
  status: z.enum(["approved", "revision_requested"]),
  feedback: z.string().max(2000).optional()
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;