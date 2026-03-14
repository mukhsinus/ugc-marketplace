// backend/src/modules/auth/auth.service.ts

import { supabaseAdmin } from "../../config/supabase";

class AuthService {

  // --------------------------------
  // LOGIN
  // --------------------------------

  async login(email: string, password: string) {

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      throw new Error("Invalid email or password");
    }

    // check ban
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profile?.is_banned) {
      throw new Error("User is banned");
    }

    return {
      user: data.user,
      session: data.session,
      profile
    };

  }

  // --------------------------------
  // SIGNUP
  // --------------------------------

  async signup(
    email: string,
    password: string,
    role: "creator" | "brand",
    name: string
  ) {

    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password
    });

    if (error || !data.user) {
      throw new Error(error?.message || "Signup failed");
    }

    const profilePayload: any = {
      id: data.user.id,
      email,
      role,
      name,
      created_at: new Date().toISOString()
    };

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert(profilePayload);

    if (profileError) {
      throw new Error(profileError.message);
    }

    return {
      user: data.user
    };

  }

  // --------------------------------
  // CURRENT USER
  // --------------------------------

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

  // --------------------------------
  // LOGOUT
  // --------------------------------

  async logout() {

    // JWT logout handled on client
    return true;

  }

}

export const authService = new AuthService();