// src/services/library.service.ts
import { api } from "@/lib/api";

export const libraryService = {

  async getMyContent() {
    const { data } = await api.get("/library/my");
    return data;
  },

  async uploadContent(payload: any) {
    const { data } = await api.post("/library", payload);
    return data;
  },

  async deleteContent(id: string) {
    const { data } = await api.delete(`/library/${id}`);
    return data;
  }

};