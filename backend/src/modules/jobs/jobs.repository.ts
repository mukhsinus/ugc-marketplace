// backend/src/modules/jobs/jobs.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class JobsRepository {

  async getOpenJobs() {
    const { data } = await supabaseAdmin
      .from("jobs")
      .select("*, profiles!jobs_brand_id_fkey(name, company_name)")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    return data;
  }

  async getJobById(id: string) {
    const { data } = await supabaseAdmin
      .from("jobs")
      .select("*, profiles!jobs_brand_id_fkey(name, company_name, avatar_url)")
      .eq("id", id)
      .single();

    return data;
  }

  async createJob(payload: any) {
    const { data } = await supabaseAdmin
      .from("jobs")
      .insert(payload)
      .select()
      .single();

    return data;
  }

  async updateJob(jobId: string, payload: any) {
    const { data } = await supabaseAdmin
      .from("jobs")
      .update(payload)
      .eq("id", jobId)
      .select()
      .single();

    return data;
  }

  async getProfileByUser(userId: string) {
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    return data;
  }

}

export const jobsRepository = new JobsRepository();