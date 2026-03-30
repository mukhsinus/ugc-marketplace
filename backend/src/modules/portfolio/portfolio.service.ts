// backend/src/modules/portfolio/portfolio.service.ts
import { portfolioRepository } from "./portfolio.repository";

class PortfolioService {

  async getMyPortfolio(userId: string) {

    const items =
      await portfolioRepository.getMyPortfolio(userId);

    return items || [];

  }

  async createPortfolioItem(userId: string, item: any) {

    return await portfolioRepository.createPortfolioItem(userId, item);

  }

  async updatePortfolioItem(itemId: string, updates: any) {

    return await portfolioRepository.updatePortfolioItem(itemId, updates);

  }

  async deletePortfolioItem(itemId: string) {

    return await portfolioRepository.deletePortfolioItem(itemId);

  }

}

export const portfolioService = new PortfolioService();