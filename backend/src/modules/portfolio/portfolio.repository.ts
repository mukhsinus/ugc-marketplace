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

}

export const portfolioRepository = new PortfolioRepository();