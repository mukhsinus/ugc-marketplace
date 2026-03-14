// src/services/upload.service.ts

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

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

async function upload(file: File): Promise<string> {

  const ext = file.name.split(".").pop();
  const path = `chat/${crypto.randomUUID()}.${ext}`;

  const uploadUrl =
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: file
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

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