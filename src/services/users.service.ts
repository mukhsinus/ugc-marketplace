// src/services/users.service.ts
import { api } from "@/lib/api";
import type { ProfileResponse } from "@/types/api-responses";

export const usersService = {

  async getProfile(): Promise<ProfileResponse> {
    const { data } = await api.get("/users/me");
    return data;
  },

  async updateProfile(payload: Partial<ProfileResponse>): Promise<ProfileResponse> {
    const { data } = await api.patch("/users/profile", payload);
    return data;
  }

};  