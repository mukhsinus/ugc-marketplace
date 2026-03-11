// backend/src/modules/submissions/submissions.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class SubmissionsRepository {

  async getJob(jobId: string) {
    const { data } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    return data;
  }

  async getProfile(userId: string) {
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    return data;
  }

  async getAcceptedCreator(jobId: string) {
    const { data } = await supabaseAdmin
      .from("proposals")
      .select("creator_id")
      .eq("job_id", jobId)
      .eq("status", "accepted")
      .maybeSingle();

    return data;
  }

  async getSubmissions(jobId: string) {
    const { data } = await supabaseAdmin
      .from("submissions")
      .select("*, profiles!submissions_creator_id_fkey(name)")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    return data;
  }

  async getSubmission(id: string) {
    const { data } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single();

    return data;
  }

  async createSubmission(payload: any) {
    const { data } = await supabaseAdmin
      .from("submissions")
      .insert(payload)
      .select()
      .single();

    return data;
  }

  async updateSubmission(id: string, payload: any) {
    const { data } = await supabaseAdmin
      .from("submissions")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    return data;
  }

  async completeJob(jobId: string) {
    await supabaseAdmin
      .from("jobs")
      .update({ status: "completed" })
      .eq("id", jobId);
  }
}

export const submissionsRepository = new SubmissionsRepository();