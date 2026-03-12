// backend/src/modules/payouts/payouts.repository.ts
import { supabaseAdmin } from "../../config/supabase";

export const payoutsRepository = {

  async create(data: any) {
    const { data: payout, error } = await supabaseAdmin
      .from("payouts")
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    return payout;
  },

  async findByUser(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("payouts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  },

  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("payouts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },

  async updateStatus(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from("payouts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

};