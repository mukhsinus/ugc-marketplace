// backend/src/modules/payouts/payouts.service.ts
import { payoutsRepository } from "./payouts.repository";
import { supabaseAdmin } from "../../config/supabase";
import { CreatePayoutInput } from "./payouts.schema";

export const payoutsService = {

  async createPayout(userId: string, input: CreatePayoutInput) {

    const { data: wallet, error } = await supabaseAdmin
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.balance < input.amount) {
      throw new Error("Insufficient balance");
    }

    const { error: walletError } = await supabaseAdmin
      .from("wallets")
      .update({
        balance: wallet.balance - input.amount
      })
      .eq("id", wallet.id);

    if (walletError) throw walletError;

    const payout = await payoutsRepository.create({
      wallet_id: wallet.id,
      user_id: userId,
      amount: input.amount,
      currency: wallet.currency,
      method: input.method,
      status: "pending",
    });

    await supabaseAdmin
      .from("transactions")
      .insert({
        wallet_id: wallet.id,
        type: "withdraw_request",
        amount: input.amount,
        currency: wallet.currency,
        status: "pending",
        description: "Payout request created",
      });

    return payout;
  },


  async getUserPayouts(userId: string) {
    return payoutsRepository.findByUser(userId);
  },


  async updatePayoutStatus(
    payoutId: string,
    status: string,
    externalReference?: string
  ) {

    const payout = await payoutsRepository.findById(payoutId);

    if (!payout) {
      throw new Error("Payout not found");
    }

    if (payout.status !== "pending") {
      throw new Error("Payout already processed");
    }

    const updated = await payoutsRepository.updateStatus(payoutId, {
      status,
      external_reference: externalReference,
      processed_at: new Date(),
    });

    if (status === "rejected") {

      const { data: wallet } = await supabaseAdmin
        .from("wallets")
        .select("*")
        .eq("id", payout.wallet_id)
        .single();

      await supabaseAdmin
        .from("wallets")
        .update({
          balance: wallet.balance + payout.amount
        })
        .eq("id", wallet.id);

      await supabaseAdmin
        .from("transactions")
        .insert({
          wallet_id: wallet.id,
          type: "payout_refund",
          amount: payout.amount,
          currency: payout.currency,
          status: "completed",
          description: "Payout rejected and refunded",
        });

    }

    if (status === "paid") {

      await supabaseAdmin
        .from("transactions")
        .insert({
          wallet_id: payout.wallet_id,
          type: "payout",
          amount: payout.amount,
          currency: payout.currency,
          status: "completed",
          description: "Payout processed",
        });

    }

    return updated;
  }

};