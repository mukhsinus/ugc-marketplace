// src/lib/auth.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";

type User = {
  id: string;
  email: string;
};

type Session = {
  access_token: string;
};

type Profile = {
  id: string;
  name: string;
  username: string | null;
  email: string;
  role: "admin" | "creator" | "brand";
  city: string | null;
  bio: string | null;
  categories: string[];
  price_from: number | null;
  instagram_link: string | null;
  tiktok_link: string | null;
  youtube_link: string | null;
  avatar_url: string | null;
  rating: number;
  review_count: number;
  company_name: string | null;
  contact_name: string | null;
  website: string | null;
  industry: string | null;
  is_banned: boolean;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, role: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

const TOKEN_KEY = "ugc_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {

    try {

      const res = await api.get("/users/me");

      const data = res?.data ?? res;

      setProfile(data);

      setUser({
        id: data.id,
        email: data.email
      });

    } catch {

      setUser(null);
      setProfile(null);

    }

  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    setSession({ access_token: token });

    fetchProfile().finally(() => {
      setLoading(false);
    });

  }, []);

  const signUp = async (
    email: string,
    password: string,
    role: string,
    name: string
  ) => {

    try {

      const res = await api.post("/auth/signup", {
        email,
        password,
        role,
        name
      });

      const data = res?.data ?? res;

      if (data?.access_token) {

        localStorage.setItem(TOKEN_KEY, data.access_token);

        setSession({ access_token: data.access_token });

        await fetchProfile();

      }

      return { error: null };

    } catch (error) {

      return { error };

    }

  };

  const signIn = async (email: string, password: string) => {

    try {

      const res = await api.post("/auth/login", {
        email,
        password
      });

      const data = res?.data ?? res;

      if (data?.access_token) {

        localStorage.setItem(TOKEN_KEY, data.access_token);

        setSession({ access_token: data.access_token });

        await fetchProfile();

      }

      return { error: null };

    } catch (error) {

      return { error };

    }

  };

  const signOut = async () => {

    localStorage.removeItem(TOKEN_KEY);

    setUser(null);
    setProfile(null);
    setSession(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext);