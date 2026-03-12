// src/hooks/useJobMessages.ts
import { useQuery } from "@tanstack/react-query";
import { messagesService } from "@/services/messages.service";

export function useJobMessages(jobId?: string) {

  return useQuery({

    queryKey: ["messages", jobId],

    queryFn: () =>
      messagesService.getJobMessages(jobId!),

    enabled: !!jobId,

    refetchInterval: 3000

  });

}