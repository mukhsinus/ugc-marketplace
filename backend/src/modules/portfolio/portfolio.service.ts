// backend/src/modules/portfolio/portfolio.service.ts
import { portfolioRepository } from "./portfolio.repository";

class PortfolioService {

  async getMyPortfolio(userId: string) {

    const items =
      await portfolioRepository.getMyPortfolio(userId);

    return items || [];

  }

}

export const portfolioService = new PortfolioService();