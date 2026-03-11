// backend/src/modules/brands/brands.service.ts
import { brandsRepository } from "./brands.repository";

class BrandsService {

  async getBrands(query: any) {

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);

    return brandsRepository.getBrands({
      page,
      limit
    });

  }

  async getBrandById(id: string) {

    const brand = await brandsRepository.getBrandById(id);

    if (!brand) {
      throw new Error("Brand not found");
    }

    return brand;

  }

  async updateBrandProfile(userId: string, payload: any) {

    const profile = await brandsRepository.getProfile(userId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    if (profile.role !== "brand") {
      throw new Error("Only brands can update brand profile");
    }

    return brandsRepository.updateBrandProfile(profile.id, payload);

  }

}

export const brandsService = new BrandsService();