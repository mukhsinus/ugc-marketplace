// backend/src/modules/brands/brands.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class BrandsRepository {

  async getBrands({ page, limit }: any) {

    const offset = (page - 1) * limit;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "brand")
      .eq("is_banned", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data;

  }

  async getBrandById(id: string) {

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .eq("role", "brand")
      .single();

    if (error) throw error;

    return data;

  }

  async getProfile(userId: string) {

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;

  }

  async updateBrandProfile(id: string, payload: any) {

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;

  }

}

export const brandsRepository = new BrandsRepository();