// ugc-marketplace/src/hooks/useProposals.ts
// ugc-marketplace/src/hooks/useProposals.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proposalsService } from "@/services/proposals.service";
import { Proposal } from "@/types/proposal";

const PROPOSALS_QUERY_KEY = "proposals";

export function useProposals(jobId: string) {
  return useQuery<Proposal[]>({
    queryKey: [PROPOSALS_QUERY_KEY, jobId],
    queryFn: () => proposalsService.getJobProposals(jobId),
    enabled: !!jobId,
  });
}

export function useCreateProposal(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      message?: string;
      price_offer?: number;
      delivery_time?: number;
    }) => proposalsService.createProposal(jobId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PROPOSALS_QUERY_KEY, jobId],
      });
    },
  });
}

export function useUpdateProposalStatus(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      proposalId,
      status,
    }: {
      proposalId: string;
      status: "accepted" | "rejected";
    }) => proposalsService.updateProposalStatus(proposalId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PROPOSALS_QUERY_KEY, jobId],
      });
    },
  });
}