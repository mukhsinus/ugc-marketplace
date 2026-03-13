// backend/src/modules/jobs/jobs.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class JobsRepository {

  async getOpenJobs() {

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select(`
        *,
        profiles!jobs_brand_id_fkey(
          id,
          name,
          company_name,
          avatar_url
        )
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;

  }

  async getJobById(id: string) {

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select(`
        *,
        profiles!jobs_brand_id_fkey(
          id,
          name,
          company_name,
          avatar_url
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;

  }

  async createJob(payload: any) {

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;

  }

  async updateJob(jobId: string, payload: any) {

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .update(payload)
      .eq("id", jobId)
      .select()
      .single();

    if (error) throw error;

    return data;

  }

  async getProfileByUser(userId: string) {

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;

  }

}

export const jobsRepository = new JobsRepository();