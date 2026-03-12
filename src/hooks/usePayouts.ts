// ugc-marketplace/src/hooks/usePayouts.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payoutsService } from "@/services/payouts.service";
import { Payout } from "@/types/payout";

const PAYOUTS_QUERY_KEY = ["payouts"];

export function usePayouts() {
  return useQuery<Payout[]>({
    queryKey: PAYOUTS_QUERY_KEY,
    queryFn: payoutsService.getMyPayouts,
  });
}

export function useCreatePayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payoutsService.createPayout,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PAYOUTS_QUERY_KEY,
      });
    },
  });
}