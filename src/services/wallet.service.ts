// ugc-marketplace/src/services/wallet.service.ts

import { api } from "@/lib/api";
import { Wallet, Transaction } from "@/types/wallet";

export const walletService = {

  async getMyWallet(): Promise<Wallet> {
    const response = await api.get("/wallet/me");
    return response.data;
  },

  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get("/wallet/transactions");
    return response.data;
  }

};