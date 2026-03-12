// backend/src/modules/payouts/payouts.service.ts
import { payoutsRepository } from "./payouts.repository";
import { supabaseAdmin } from "../../config/supabase";
import { CreatePayoutInput } from "./payouts.schema";

export const payoutsService = {

  async createPayout(userId: string, input: CreatePayoutInput) {

    const { data: wallet } = await supabaseAdmin
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.balance < input.amount) {
      throw new Error("Insufficient balance");
    }

    const payout = await payoutsRepository.create({
      wallet_id: wallet.id,
      user_id: userId,
      amount: input.amount,
      currency: wallet.currency,
      method: input.method,
      status: "pending",
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

    return payoutsRepository.updateStatus(payoutId, {
      status,
      external_reference: externalReference,
      processed_at: new Date(),
    });
  },

};