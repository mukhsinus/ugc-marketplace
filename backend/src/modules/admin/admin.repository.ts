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
          name,
          company_name,
          email
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

  },


  async getDashboardData() {

    const [profilesRes, jobsRes, settingsRes] = await Promise.all([

      supabaseAdmin
        .from("profiles")
        .select("*"),

      supabaseAdmin
        .from("jobs")
        .select(`
          *,
          profiles:brand_id (
            id,
            name,
            company_name
          )
        `),

      supabaseAdmin
        .from("platform_settings")
        .select("*")
        .eq("key", "commission_rate")
        .single()

    ]);

    if (profilesRes.error) throw profilesRes.error;
    if (jobsRes.error) throw jobsRes.error;

    return {
      profiles: profilesRes.data ?? [],
      jobs: jobsRes.data ?? [],
      commission: settingsRes.data?.value ?? "15"
    };

  },


  async updateCommission(value: number) {

    const { data, error } = await supabaseAdmin
      .from("platform_settings")
      .update({ value })
      .eq("key", "commission_rate")
      .select()
      .single();

    if (error) throw error;

    return data;

  }

};