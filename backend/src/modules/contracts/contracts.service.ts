// backend/src/modules/contracts/contracts.service.ts
import { supabaseAdmin } from "../../config/supabase";

const PLATFORM_FEE_PERCENT = 0.10;

export const contractsService = {

  async createContract(
    jobId: string,
    brandId: string,
    creatorId: string,
    amount: number,
    currency: string
  ) {

    const { data, error } = await supabaseAdmin
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

    return data;
  },


  async getContractByJob(jobId: string) {

    const { data, error } = await supabaseAdmin
      .from("contracts")
      .select("*")
      .eq("job_id", jobId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data;
  },


  async createEscrow(
    contractId: string,
    payerWalletId: string,
    payeeWalletId: string,
    amount: number,
    currency: string
  ) {

    const { data: payerWallet } = await supabaseAdmin
      .from("wallets")
      .select("*")
      .eq("id", payerWalletId)
      .single();

    if (!payerWallet) {
      throw new Error("Payer wallet not found");
    }

    if (payerWallet.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    const { error: balanceError } = await supabaseAdmin
      .from("wallets")
      .update({
        balance: payerWallet.balance - amount
      })
      .eq("id", payerWalletId);

    if (balanceError) throw balanceError;

    const { data: escrow, error } = await supabaseAdmin
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

    await supabaseAdmin
      .from("transactions")
      .insert({
        wallet_id: payerWalletId,
        contract_id: contractId,
        type: "escrow_hold",
        amount,
        currency,
        status: "completed",
        description: "Escrow funds locked"
      });

    return escrow;
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

    if (escrow.status !== "held") {
      throw new Error("Escrow already processed");
    }

    const fee = escrow.amount * PLATFORM_FEE_PERCENT;
    const creatorAmount = escrow.amount - fee;

    const { data: creatorWallet } = await supabaseAdmin
      .from("wallets")
      .select("*")
      .eq("id", escrow.payee_wallet_id)
      .single();

    if (!creatorWallet) {
      throw new Error("Creator wallet not found");
    }

    await supabaseAdmin
      .from("wallets")
      .update({
        balance: creatorWallet.balance + creatorAmount
      })
      .eq("id", escrow.payee_wallet_id);

    await supabaseAdmin
      .from("escrow_accounts")
      .update({
        status: "released",
        released_at: new Date()
      })
      .eq("id", escrow.id);

    await supabaseAdmin
      .from("transactions")
      .insert([
        {
          wallet_id: escrow.payee_wallet_id,
          contract_id: contractId,
          type: "payout",
          amount: creatorAmount,
          currency: escrow.currency,
          status: "completed",
          description: "Escrow released to creator"
        },
        {
          wallet_id: escrow.payer_wallet_id,
          contract_id: contractId,
          type: "platform_fee",
          amount: fee,
          currency: escrow.currency,
          status: "completed",
          description: "Platform commission"
        }
      ]);

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

    if (escrow.status !== "held") {
      throw new Error("Escrow already processed");
    }

    const { data: payerWallet } = await supabaseAdmin
      .from("wallets")
      .select("*")
      .eq("id", escrow.payer_wallet_id)
      .single();

    await supabaseAdmin
      .from("wallets")
      .update({
        balance: payerWallet.balance + escrow.amount
      })
      .eq("id", escrow.payer_wallet_id);

    await supabaseAdmin
      .from("escrow_accounts")
      .update({
        status: "refunded"
      })
      .eq("id", escrow.id);

    await supabaseAdmin
      .from("transactions")
      .insert({
        wallet_id: escrow.payer_wallet_id,
        contract_id: contractId,
        type: "refund",
        amount: escrow.amount,
        currency: escrow.currency,
        status: "completed",
        description: "Escrow refunded to brand"
      });

    return true;
  }

};