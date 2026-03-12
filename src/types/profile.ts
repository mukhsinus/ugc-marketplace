// src/types/profile.ts
export type UserRole =
  | "admin"
  | "creator"
  | "brand";

export interface Profile {
  id: string;

  user_id: string;

  email: string;

  role: UserRole;

  name?: string | null;
  username?: string | null;

  city?: string | null;
  bio?: string | null;

  categories?: string[] | null;

  price_from?: number | null;

  instagram_link?: string | null;
  tiktok_link?: string | null;
  youtube_link?: string | null;

  avatar_url?: string | null;

  rating?: number | null;
  review_count?: number | null;

  company_name?: string | null;
  contact_name?: string | null;
  website?: string | null;
  industry?: string | null;

  is_banned?: boolean | null;

  created_at: string;
  updated_at: string;
}