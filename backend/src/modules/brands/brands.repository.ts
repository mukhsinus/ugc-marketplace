// backend/src/modules/brands/brands.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class BrandsRepository {

  async getBrands({ page, limit }: any) {

    const offset = (page - 1) * limit;

    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "brand")
      .eq("is_banned", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return data;

  }

  async getBrandById(id: string) {

    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .eq("role", "brand")
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

  async updateBrandProfile(id: string, payload: any) {

    const { data } = await supabaseAdmin
      .from("profiles")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    return data;

  }

}

export const brandsRepository = new BrandsRepository();