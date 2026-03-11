// backend/src/modules/messages/messages.service.ts
import { messagesRepository } from "./messages.repository";

class MessagesService {

  async getMessages(userId: string, jobId: string) {

    const job = await messagesRepository.getJob(jobId);
    const profile = await messagesRepository.getProfile(userId);

    if (!job || !profile) {
      throw new Error("Invalid request");
    }

    const acceptedCreator = await messagesRepository.getAcceptedCreator(jobId);

    const isParticipant =
      job.brand_id === profile.id ||
      acceptedCreator?.creator_id === profile.id;

    if (!isParticipant) {
      throw new Error("Forbidden");
    }

    return messagesRepository.getMessages(jobId);
  }

  async sendMessage(userId: string, payload: any) {

    const { job_id, text } = payload;

    const job = await messagesRepository.getJob(job_id);
    const profile = await messagesRepository.getProfile(userId);

    if (!job || !profile) {
      throw new Error("Invalid request");
    }

    const acceptedCreator = await messagesRepository.getAcceptedCreator(job_id);

    const isParticipant =
      job.brand_id === profile.id ||
      acceptedCreator?.creator_id === profile.id;

    if (!isParticipant) {
      throw new Error("Forbidden");
    }

    return messagesRepository.createMessage({
      job_id,
      sender_id: profile.id,
      text
    });
  }
}

export const messagesService = new MessagesService();