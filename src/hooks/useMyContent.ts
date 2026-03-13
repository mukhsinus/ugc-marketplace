// src/hooks/useMyContent.ts
import { useQuery } from "@tanstack/react-query";
import { libraryService } from "@/services/library.service";

export function useMyContent() {

  return useQuery({
    queryKey: ["my-content"],
    queryFn: () => libraryService.getMyContent()
  });

}