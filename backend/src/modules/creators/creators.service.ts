// backend/src/modules/creators/creators.service.ts
import { creatorsRepository } from "./creators.repository";

class CreatorsService {

  async getCreators(query: any) {

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);

    const filters = {
      search: query.search,
      category: query.category,
      city: query.city
    };

    return creatorsRepository.getCreators({
      page,
      limit,
      filters
    });

  }

  async getCreatorById(id: string) {

    const creator = await creatorsRepository.getCreatorById(id);

    if (!creator) {
      throw new Error("Creator not found");
    }

    return creator;

  }

}

export const creatorsService = new CreatorsService();