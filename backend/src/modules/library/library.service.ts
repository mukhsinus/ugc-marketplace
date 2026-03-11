// backend/src/modules/library/library.service.ts
import { libraryRepository } from "./library.repository";

class LibraryService {

  async getLibrary(category?: string) {

    return libraryRepository.getLibrary(category);

  }

  async getLibraryItem(id: string) {

    const item = await libraryRepository.getLibraryItem(id);

    if (!item) {
      throw new Error("Item not found");
    }

    return item;

  }

  async createLibraryItem(userId: string, payload: any) {

    const profile = await libraryRepository.getProfile(userId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    if (profile.role !== "creator") {
      throw new Error("Only creators can upload content");
    }

    return libraryRepository.createLibraryItem({
      ...payload,
      creator_id: profile.id
    });

  }

  async deleteLibraryItem(userId: string, itemId: string) {

    const profile = await libraryRepository.getProfile(userId);

    const item = await libraryRepository.getLibraryItem(itemId);

    if (!profile || !item) {
      throw new Error("Invalid request");
    }

    if (item.creator_id !== profile.id) {
      throw new Error("Forbidden");
    }

    await libraryRepository.deleteLibraryItem(itemId);

  }

}

export const libraryService = new LibraryService();