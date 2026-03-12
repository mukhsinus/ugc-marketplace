// backend/src/modules/admin/admin.repository.ts
import { supabaseAdmin } from "../../config/supabase";

export const adminRepository = {

  async getUsers() {

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;

  },


  async updateUserBan(userId: string, banned: boolean) {

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ is_banned: banned })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return data;

  },


  async getPayouts() {

    const { data, error } = await supabaseAdmin
      .from("payouts")
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          role
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;

  },


  async getJobs() {

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select(`
        *,
        profiles:brand_id (
          id,
          email,
          role
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;

  },


  async deleteJob(jobId: string) {

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .delete()
      .eq("id", jobId)
      .select()
      .single();

    if (error) throw error;

    return data;

  }

};