// src/hooks/useConversations.ts
import { useQuery } from "@tanstack/react-query";
import { messagesService } from "@/services/messages.service";

export function useConversations() {

  return useQuery({
    queryKey: ["conversations"],
    queryFn: messagesService.getConversations
  });

}