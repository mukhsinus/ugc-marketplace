// src/hooks/usePortfolio.ts
import { useQuery } from "@tanstack/react-query";
import { portfolioService } from "@/services/portfolio.service";

export function usePortfolio() {

  return useQuery({
    queryKey: ["portfolio"],
    queryFn: () => portfolioService.getMyPortfolio()
  });

}