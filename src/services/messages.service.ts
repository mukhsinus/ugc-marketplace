// src/services/messages.service.ts
import { api } from "@/lib/api";

export const messagesService = {

  async getConversations() {

    const { data } =
      await api.get("/messages/conversations");

    return data;

  },

  async getJobMessages(jobId: string) {

    const { data } =
      await api.get(`/messages/${jobId}`);

    return data;

  },

  async sendMessage(
    jobId: string,
    text: string
  ) {

    const { data } =
      await api.post(`/messages/${jobId}`, {
        text
      });

    return data;

  }

};