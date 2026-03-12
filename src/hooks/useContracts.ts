// ugc-marketplace/src/hooks/useContracts.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractsService } from "@/services/contracts.service";
import { Contract } from "@/types/contract";

const CONTRACT_QUERY_KEY = "contract";

export function useContract(jobId: string) {
  return useQuery<Contract | null>({
    queryKey: [CONTRACT_QUERY_KEY, jobId],
    queryFn: () => contractsService.getContractByJob(jobId),
    enabled: !!jobId,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractsService.createContract,

    onSuccess: (contract) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_QUERY_KEY, contract.job_id],
      });
    },
  });
}

export function useReleaseEscrow(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) =>
      contractsService.releaseEscrow(contractId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_QUERY_KEY, jobId],
      });
    },
  });
}

export function useCancelEscrow(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) =>
      contractsService.cancelEscrow(contractId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_QUERY_KEY, jobId],
      });
    },
  });
}