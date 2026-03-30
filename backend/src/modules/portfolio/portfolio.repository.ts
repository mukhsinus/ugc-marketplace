// backend/src/modules/portfolio/portfolio.repository.ts
import { supabaseAdmin } from "../../config/supabase";

class PortfolioRepository {

  async getMyPortfolio(userId: string) {

    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .select("*")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;

  }

  async createPortfolioItem(userId: string, item: any) {

    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .insert([{ ...item, creator_id: userId }])
      .select()
      .single();

    if (error) throw error;

    return data;

  }

  async updatePortfolioItem(itemId: string, updates: any) {

    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .update(updates)
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw error;

    return data;

  }

  async deletePortfolioItem(itemId: string) {

    const { error } = await supabaseAdmin
      .from("portfolio")
      .delete()
      .eq("id", itemId);

    if (error) throw error;

    return true;

  }

}

export const portfolioRepository = new PortfolioRepository();