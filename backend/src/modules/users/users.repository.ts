// backend/src/modules/users/users.repository.ts
import { supabaseAdmin } from "../../config/supabase";

interface ProfileData {
  id?: string;
  user_id: string;
  name: string;
  email: string;
  username?: string;
  role: "admin" | "creator" | "brand";
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
  is_banned?: boolean;
}

class UsersRepository {
  
  /**
   * Get profile by user ID (auth user ID, not profile ID)
   */
  async getProfileByUserId(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get profile by profile ID (public profiles)
   */
  async getProfileById(profileId: string) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Search creator profiles with filters
   */
  async searchCreators(filters?: {
    categories?: string[];
    city?: string;
    minRating?: number;
    limit?: number;
    offset?: number;
  }) {
    let query = supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "creator")
      .eq("is_banned", false)
      .order("rating", { ascending: false });

    if (filters?.categories && filters.categories.length > 0) {
      query = query.contains("categories", filters.categories);
    }

    if (filters?.city) {
      query = query.eq("city", filters.city);
    }

    if (filters?.minRating) {
      query = query.gte("rating", filters.minRating);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * List all brands
   */
  async searchBrands(filters?: {
    limit?: number;
    offset?: number;
  }) {
    let query = supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "brand")
      .eq("is_banned", false)
      .order("created_at", { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Update profile
   */
  async updateProfile(userId: string, payload: Partial<ProfileData>) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(payload)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Check if user is banned
   */
  async isUserBanned(userId: string): Promise<boolean> {
    const profile = await this.getProfileByUserId(userId);
    return profile?.is_banned || false;
  }

  /**
   * Get creator stats
   */
  async getCreatorStats(userId: string) {
    const profile = await this.getProfileByUserId(userId);
    
    if (!profile || profile.role !== "creator") {
      throw new Error("User is not a creator");
    }

    // Get job count
    const { count: jobCount } = await supabaseAdmin
      .from("proposals")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", profile.id);

    // Get earnings
    const { data: payouts } = await supabaseAdmin
      .from("payouts")
      .select("amount")
      .eq("creator_id", profile.id)
      .eq("status", "completed");

    const totalEarnings = payouts?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    return {
      profile,
      proposalCount: jobCount || 0,
      totalEarnings,
      rating: profile.rating,
      reviewCount: profile.review_count,
    };
  }

  /**
   * Get brand stats
   */
  async getBrandStats(userId: string) {
    const profile = await this.getProfileByUserId(userId);
    
    if (!profile || profile.role !== "brand") {
      throw new Error("User is not a brand");
    }

    // Get total jobs posted
    const { count: jobCount } = await supabaseAdmin
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("brand_id", profile.id);

    // Get total spent
    const { data: contracts } = await supabaseAdmin
      .from("contracts")
      .select("total_amount")
      .eq("brand_id", profile.id);

    const totalSpent = contracts?.reduce((sum, c) => sum + (c.total_amount || 0), 0) || 0;

    return {
      profile,
      jobCount: jobCount || 0,
      totalSpent,
    };
  }
}

export const usersRepository = new UsersRepository();