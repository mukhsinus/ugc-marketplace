// backend/src/modules/auth/auth.service.ts
import { supabaseAdmin } from "../../config/supabase";

class AuthService {

  async getCurrentUser(userId: string) {

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;

  }

  async logout() {

    // Supabase JWT logout handled client-side
    // This endpoint exists for API symmetry
    return true;

  }

}

export const authService = new AuthService();