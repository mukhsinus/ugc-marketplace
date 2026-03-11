// backend/src/modules/library/library.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class LibraryRepository {

  async getLibrary(category?: string) {

    let query = supabaseAdmin
      .from("content_library")
      .select("*, profiles!content_library_creator_id_fkey(name)")
      .eq("is_active", true);

    if (category) {
      query = query.eq("category", category);
    }

    const { data } = await query.order("created_at", { ascending: false });

    return data;

  }

  async getLibraryItem(id: string) {

    const { data } = await supabaseAdmin
      .from("content_library")
      .select("*")
      .eq("id", id)
      .single();

    return data;

  }

  async createLibraryItem(payload: any) {

    const { data } = await supabaseAdmin
      .from("content_library")
      .insert(payload)
      .select()
      .single();

    return data;

  }

  async deleteLibraryItem(id: string) {

    await supabaseAdmin
      .from("content_library")
      .delete()
      .eq("id", id);

  }

  async getProfile(userId: string) {

    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    return data;

  }

}

export const libraryRepository = new LibraryRepository();