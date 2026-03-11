// backend/src/modules/creators/creators.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class CreatorsRepository {

  async getCreators({ page, limit, filters }: any) {

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "creator")
      .eq("is_banned", false);

    if (filters.city) {
      query = query.eq("city", filters.city);
    }

    if (filters.category) {
      query = query.contains("categories", [filters.category]);
    }

    if (filters.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    const { data } = await query
      .order("rating", { ascending: false })
      .range(offset, offset + limit - 1);

    return data;

  }

  async getCreatorById(id: string) {

    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .eq("role", "creator")
      .single();

    return data;

  }

}

export const creatorsRepository = new CreatorsRepository();