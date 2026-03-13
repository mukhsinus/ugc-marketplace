// backend/src/modules/messages/messages.service.ts

import { messagesRepository } from "./messages.repository";

interface SendMessagePayload {
  job_id: string;
  text?: string | null;
  attachments?: any[];
}

class MessagesService {

  async getConversations(userId: string) {

    const profile = await messagesRepository.getProfile(userId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    const conversations =
      await messagesRepository.getUserConversations(profile.id);

    const unique = new Map<string, any>();

    for (const item of conversations || []) {

      if (!unique.has(item.job_id)) {

        unique.set(item.job_id, {
          jobId: item.job_id,
          title: item.jobs?.title || null,
          brand: item.jobs?.profiles || null
        });

      }

    }

    return Array.from(unique.values());

  }

  async getMessages(userId: string, jobId: string) {

    const job = await messagesRepository.getJob(jobId);
    const profile = await messagesRepository.getProfile(userId);

    if (!job || !profile) {
      throw new Error("Invalid request");
    }

    const acceptedCreator =
      await messagesRepository.getAcceptedCreator(jobId);

    const isParticipant =
      job.brand_id === profile.id ||
      acceptedCreator?.creator_id === profile.id;

    if (!isParticipant) {
      throw new Error("Forbidden");
    }

    const messages =
      await messagesRepository.getMessages(jobId);

    return {
      job: {
        id: job.id,
        title: job.title,
        brand: job.profiles || null
      },
      messages: messages || []
    };

  }

  async sendMessage(userId: string, payload: SendMessagePayload) {

    const { job_id, text, attachments } = payload;

    const job = await messagesRepository.getJob(job_id);
    const profile = await messagesRepository.getProfile(userId);

    if (!job || !profile) {
      throw new Error("Invalid request");
    }

    const acceptedCreator =
      await messagesRepository.getAcceptedCreator(job_id);

    const isParticipant =
      job.brand_id === profile.id ||
      acceptedCreator?.creator_id === profile.id;

    if (!isParticipant) {
      throw new Error("Forbidden");
    }

    const message =
      await messagesRepository.createMessage({
        job_id,
        sender_id: profile.id,
        text: text || null,
        attachments: attachments || []
      });

    const fastify = (global as any)?.fastify;

    if (fastify?.broadcastMessage) {
      fastify.broadcastMessage(job_id, message);
    }

    return message;

  }

  async markMessageSeen(userId: string, messageId: string) {

    const message =
      await messagesRepository.getMessage(messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const job =
      await messagesRepository.getJob(message.job_id);

    const profile =
      await messagesRepository.getProfile(userId);

    if (!profile || !job) {
      throw new Error("Invalid request");
    }

    const acceptedCreator =
      await messagesRepository.getAcceptedCreator(message.job_id);

    const isParticipant =
      job.brand_id === profile.id ||
      acceptedCreator?.creator_id === profile.id;

    if (!isParticipant) {
      throw new Error("Forbidden");
    }

    const updated =
      await messagesRepository.markAsSeen(messageId);

    const fastify = (global as any)?.fastify;

    if (fastify?.broadcastMessageSeen) {

      fastify.broadcastMessageSeen(message.job_id, {
        messageId,
        seenAt: updated?.seen_at
      });

    }

    return updated;

  }

  async deleteMessage(userId: string, messageId: string) {

    const message =
      await messagesRepository.getMessage(messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const profile =
      await messagesRepository.getProfile(userId);

    if (!profile) {
      throw new Error("Invalid request");
    }

    if (message.sender_id !== profile.id) {
      throw new Error("Forbidden");
    }

    const deleted =
      await messagesRepository.deleteMessage(messageId);

    const fastify = (global as any)?.fastify;

    if (fastify?.broadcastMessageDeleted) {

      fastify.broadcastMessageDeleted(message.job_id, {
        messageId
      });

    }

    return deleted;

  }

}

export const messagesService = new MessagesService();