// src/services/users.service.ts
import { api } from "@/lib/api";

export const usersService = {

  async getProfile() {
    const { data } = await api.get("/users/me");
    return data;
  },

  async updateProfile(payload: any) {
    const { data } = await api.patch("/users/profile", payload);
    return data;
  }

};  