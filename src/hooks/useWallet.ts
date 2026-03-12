// ugc-marketplace/src/hooks/useWallet.ts

import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { Wallet, Transaction } from "@/types/wallet";

const WALLET_QUERY_KEY = ["wallet"];
const TRANSACTIONS_QUERY_KEY = ["transactions"];

export function useWallet() {
  return useQuery<Wallet>({
    queryKey: WALLET_QUERY_KEY,
    queryFn: walletService.getMyWallet,
  });
}

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: walletService.getTransactions,
  });
}