// src/services/messages.service.ts
import { api } from "@/lib/api";

export type Attachment = {
  type: "image" | "video" | "file";
  url: string;
  name: string;
  size: number;
};

export const messagesService = {

  async getConversations() {

    const { data } = await api.get("/messages/conversations");

    return data;

  },

  async getJobMessages(jobId: string) {

    const { data } = await api.get(`/messages/${jobId}`);

    return data;

  },

  async sendMessage(
    jobId: string,
    text?: string,
    attachments: Attachment[] = []
  ) {

    const payload = {
      job_id: jobId,
      text: text ?? null,
      attachments
    };

    const { data } = await api.post(
      `/messages/${jobId}`,
      payload
    );

    return data;

  }

};