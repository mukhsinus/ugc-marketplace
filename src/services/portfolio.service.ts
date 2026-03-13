// src/services/portfolio.service.ts
import { api } from "@/lib/api";

export const portfolioService = {

  async getMyPortfolio() {
    const { data } = await api.get("/portfolio/my");
    return data;
  },

  async createPortfolioItem(payload: any) {
    const { data } = await api.post("/portfolio", payload);
    return data;
  },

  async deletePortfolioItem(id: string) {
    const { data } = await api.delete(`/portfolio/${id}`);
    return data;
  }

};