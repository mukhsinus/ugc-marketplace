// backend/src/modules/messages/messages.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class MessagesRepository {

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

  async getMessages(jobId: string) {
    const { data } = await supabaseAdmin
      .from("messages")
      .select("*, profiles!messages_sender_id_fkey(name, avatar_url, role)")
      .eq("job_id", jobId)
      .order("created_at", { ascending: true });

    return data;
  }

  async createMessage(payload: any) {
    const { data } = await supabaseAdmin
      .from("messages")
      .insert(payload)
      .select()
      .single();

    return data;
  }
}

export const messagesRepository = new MessagesRepository();