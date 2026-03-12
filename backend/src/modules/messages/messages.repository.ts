// backend/src/modules/messages/messages.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class MessagesRepository {

  async getJob(jobId: string) {

    const { data } = await supabaseAdmin
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
      .select(`
        *,
        profiles!messages_sender_id_fkey(
          id,
          name,
          avatar_url,
          role
        )
      `)
      .eq("job_id", jobId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    return data;
  }

  async getMessage(messageId: string) {

    const { data } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("id", messageId)
      .single();

    return data;
  }

  async createMessage(payload: any) {

    const { data } = await supabaseAdmin
      .from("messages")
      .insert(payload)
      .select(`
        *,
        profiles!messages_sender_id_fkey(
          id,
          name,
          avatar_url,
          role
        )
      `)
      .single();

    return data;
  }

  async markAsSeen(messageId: string) {

    const { data } = await supabaseAdmin
      .from("messages")
      .update({
        seen_at: new Date()
      })
      .eq("id", messageId)
      .select()
      .single();

    return data;
  }

}

export const messagesRepository = new MessagesRepository();