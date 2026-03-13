// src/services/upload.service.ts
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "chat-attachments";

export type Attachment = {
  type: "image" | "video" | "file";
  url: string;
  name: string;
  size: number;
};

function detectType(file: File): Attachment["type"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

async function upload(file: File) {
  const ext = file.name.split(".").pop();
  const path = `chat/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase
    .storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) {
    throw error;
  }

  const { data } = supabase
    .storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadVideo(file: File) {
  return upload(file);
}

export const uploadService = {

  async uploadFile(file: File): Promise<Attachment> {

    const url = await upload(file);

    return {
      type: detectType(file),
      url,
      name: file.name,
      size: file.size
    };

  }

};