// backend/src/modules/contracts/contracts.service.ts
// backend/src/modules/contracts/contracts.service.ts

import { supabaseAdmin } from "../../config/supabase";

export const contractsService = {

  async createContract(
    jobId: string,
    brandId: string,
    creatorId: string,
    amount: number,
    currency: string
  ) {

    const { data: contract, error } = await supabaseAdmin
      .from("contracts")
      .insert({
        job_id: jobId,
        brand_id: brandId,
        creator_id: creatorId,
        amount,
        currency,
        status: "active"
      })
      .select()
      .single();

    if (error) throw error;

    return contract;
  },

  async getContractByJob(jobId: string) {

    const { data, error } = await supabaseAdmin
      .from("contracts")
      .select("*")
      .eq("job_id", jobId)
      .single();

    if (error) throw error;

    return data;
  },

  async createEscrow(
    contractId: string,
    payerWalletId: string,
    payeeWalletId: string,
    amount: number,
    currency: string
  ) {

    const { data, error } = await supabaseAdmin
      .from("escrow_accounts")
      .insert({
        contract_id: contractId,
        payer_wallet_id: payerWalletId,
        payee_wallet_id: payeeWalletId,
        amount,
        currency,
        status: "held"
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async releaseEscrow(contractId: string) {

    const { data: escrow } = await supabaseAdmin
      .from("escrow_accounts")
      .select("*")
      .eq("contract_id", contractId)
      .single();

    if (!escrow) {
      throw new Error("Escrow not found");
    }

    await supabaseAdmin
      .from("wallets")
      .update({
        balance: supabaseAdmin.rpc("increment_balance", {
          wallet_id: escrow.payee_wallet_id,
          amount: escrow.amount
        })
      });

    const { error } = await supabaseAdmin
      .from("escrow_accounts")
      .update({
        status: "released",
        released_at: new Date()
      })
      .eq("id", escrow.id);

    if (error) throw error;

    return true;
  },

  async cancelEscrow(contractId: string) {

    const { data: escrow } = await supabaseAdmin
      .from("escrow_accounts")
      .select("*")
      .eq("contract_id", contractId)
      .single();

    if (!escrow) {
      throw new Error("Escrow not found");
    }

    await supabaseAdmin
      .from("wallets")
      .update({
        balance: supabaseAdmin.rpc("increment_balance", {
          wallet_id: escrow.payer_wallet_id,
          amount: escrow.amount
        })
      });

    const { error } = await supabaseAdmin
      .from("escrow_accounts")
      .update({
        status: "refunded"
      })
      .eq("id", escrow.id);

    if (error) throw error;

    return true;
  }

};