// src/hooks/api/useJobs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/services/jobs.service";
import type { Job } from "@/types/job";

/**
 * Получить список jobs
 */
export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsService.getJobs(),
  });
}

/**
 * Получить один job
 */
export function useJob(jobId: string) {
  return useQuery({
    queryKey: ["jobs", jobId],
    queryFn: () => jobsService.getJobById(jobId),
    enabled: !!jobId,
  });
}

/**
 * Создать job
 */
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Job>) => jobsService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}

/**
 * Обновить job
 */
export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      data,
    }: {
      jobId: string;
      data: Partial<Job>;
    }) => jobsService.updateJob(jobId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["jobs", variables.jobId],
      });
    },
  });
}