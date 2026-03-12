// backend/src/modules/messages/messages.service.ts
import { messagesRepository } from "./messages.repository";

class MessagesService {

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
      messages
    };
  }

  async sendMessage(userId: string, payload: any) {

    const { job_id, text } = payload;

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
        text
      });

    const fastify = (global as any).fastify;

    if (fastify && fastify.broadcastMessage) {
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

    const fastify = (global as any).fastify;

    if (fastify && fastify.broadcastMessageSeen) {
      fastify.broadcastMessageSeen(message.job_id, {
        messageId: messageId,
        seenAt: updated?.seen_at
      });
    }

    return updated;
  }

}

export const messagesService = new MessagesService();