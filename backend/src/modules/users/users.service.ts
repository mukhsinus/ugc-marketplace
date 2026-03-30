// backend/src/modules/users/users.service.ts
import { usersRepository } from "./users.repository";

interface UpdateProfilePayload {
  name?: string;
  username?: string;
  bio?: string;
  city?: string;
  categories?: string[];
  price_from?: number;
  instagram_link?: string;
  tiktok_link?: string;
  youtube_link?: string;
  avatar_url?: string;
  company_name?: string;
  contact_name?: string;
  website?: string;
  industry?: string;
}

class UsersService {
  
  /**
   * Get current user's profile
   */
  async getMyProfile(userId: string) {
    const profile = await usersRepository.getProfileByUserId(userId);
    
    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  }

  /**
   * Get any user's public profile
   */
  async getPublicProfile(profileId: string) {
    const profile = await usersRepository.getProfileById(profileId);
    
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Don't expose sensitive data for non-owned profiles
    return {
      id: profile.id,
      user_id: profile.user_id,
      name: profile.name,
      username: profile.username,
      role: profile.role,
      bio: profile.bio,
      city: profile.city,
      categories: profile.categories,
      price_from: profile.price_from,
      instagram_link: profile.instagram_link,
      tiktok_link: profile.tiktok_link,
      youtube_link: profile.youtube_link,
      avatar_url: profile.avatar_url,
      rating: profile.rating,
      review_count: profile.review_count,
      company_name: profile.company_name,
      website: profile.website,
      created_at: profile.created_at,
    };
  }

  /**
   * Update user's profile
   */
  async updateProfile(userId: string, payload: UpdateProfilePayload) {
    // Check if user is banned
    const isBanned = await usersRepository.isUserBanned(userId);
    if (isBanned) {
      throw new Error("This account has been suspended");
    }

    // Validate username if provided
    if (payload.username) {
      const username = payload.username.toLowerCase().trim();
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters");
      }
      if (!/^[a-z0-9_]+$/.test(username)) {
        throw new Error("Username can only contain lowercase letters, numbers, and underscores");
      }
      payload.username = username;
    }

    // Validate categories if provided
    if (payload.categories) {
      const validCategories = ["beauty", "fashion", "food", "tech", "lifestyle", "fitness", "education", "travel"];
      const invalid = payload.categories.filter(c => !validCategories.includes(c));
      if (invalid.length > 0) {
        throw new Error(`Invalid categories: ${invalid.join(", ")}`);
      }
    }

    // Validate price_from if provided
    if (payload.price_from !== undefined && payload.price_from < 0) {
      throw new Error("Price must be positive");
    }

    const updated = await usersRepository.updateProfile(userId, payload);
    return updated;
  }

  /**
   * Search for creators
   */
  async searchCreators(filters?: {
    categories?: string[];
    city?: string;
    minRating?: number;
    limit?: number;
    offset?: number;
  }) {
    const limit = Math.min(filters?.limit || 10, 100); // Cap at 100
    const offset = filters?.offset || 0;

    return usersRepository.searchCreators({
      ...filters,
      limit,
      offset,
    });
  }

  /**
   * Search for brands
   */
  async searchBrands(filters?: {
    limit?: number;
    offset?: number;
  }) {
    const limit = Math.min(filters?.limit || 10, 100); // Cap at 100
    const offset = filters?.offset || 0;

    return usersRepository.searchBrands({
      ...filters,
      limit,
      offset,
    });
  }

  /**
   * Get creator dashboard stats
   */
  async getCreatorStats(userId: string) {
    return usersRepository.getCreatorStats(userId);
  }

  /**
   * Get brand dashboard stats
   */
  async getBrandStats(userId: string) {
    return usersRepository.getBrandStats(userId);
  }
}

export const usersService = new UsersService();