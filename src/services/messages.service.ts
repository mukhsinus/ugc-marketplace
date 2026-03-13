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

    const res = await api.get("/messages/conversations");

    return res.data ?? [];

  },

  async getJobMessages(jobId: string) {

    const res = await api.get(`/messages/${jobId}`);

    return res.data ?? { messages: [] };

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

    const res = await api.post("/messages", payload);

    return res.data;

  }

};