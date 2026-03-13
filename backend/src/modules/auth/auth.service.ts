// backend/src/modules/auth/auth.service.ts
import { supabaseAdmin } from "../../config/supabase";

class AuthService {

  async getCurrentUser(userId: string) {

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;

  }

  async logout() {

    // JWT logout handled on client
    return true;

  }

}

export const authService = new AuthService();