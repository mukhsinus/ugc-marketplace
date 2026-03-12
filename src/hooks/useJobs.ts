// ugc-marketplace/src/hooks/useJobs.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/services/jobs.service";
import { Job } from "@/types/job";

const JOBS_QUERY_KEY = ["jobs"];

export function useJobs() {
  return useQuery<Job[]>({
    queryKey: JOBS_QUERY_KEY,
    queryFn: jobsService.getJobs,
  });
}

export function useJob(jobId: string) {
  return useQuery<Job>({
    queryKey: ["job", jobId],
    queryFn: () => jobsService.getJobById(jobId),
    enabled: !!jobId,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsService.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: Partial<Job> }) =>
      jobsService.updateJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
}