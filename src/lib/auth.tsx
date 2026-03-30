// src/lib/auth.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";

import { api } from "@/lib/api";
import type { UserResponse, ProfileResponse, LoginResponse } from "@/types/api-responses";

const TOKEN_KEY = "ugc_token";

/* ------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------ */

type User = UserResponse;
type Profile = ProfileResponse;

type Session = {
  access_token: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    role: string,
    name: string
  ) => Promise<{ error: any }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: any }>;

  signOut: () => Promise<void>;

  refreshProfile: () => Promise<void>;
};

/* ------------------------------------------------ */
/* CONTEXT */
/* ------------------------------------------------ */

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {}
});

/* ------------------------------------------------ */
/* PROVIDER */
/* ------------------------------------------------ */

export const AuthProvider = ({
  children
}: {
  children: ReactNode;
}) => {

  const [user, setUser] = useState<User | null>(null);

  const [session, setSession] = useState<Session | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------ */
  /* PROFILE LOAD */
  /* ------------------------------------------------ */

  const fetchProfile = async () => {

    try {

      const res = await api.get("/users/me");

      const data = res?.data ?? res;

      setProfile(data);

      setUser({
        id: data.id,
        email: data.email
      });

    } catch (err) {

      console.error("Profile fetch error:", err);

      setUser(null);
      setProfile(null);

    }

  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  /* ------------------------------------------------ */
  /* INITIAL AUTH CHECK */
  /* ------------------------------------------------ */

  useEffect(() => {

    const initAuth = async () => {

      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      setSession({
        access_token: token
      });

      await fetchProfile();

      setLoading(false);

    };

    initAuth();

  }, []);

  /* ------------------------------------------------ */
  /* SIGNUP */
/* ------------------------------------------------ */

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

      if (data?.session?.access_token) {

        const token = data.session.access_token;

        localStorage.setItem(TOKEN_KEY, token);

        setSession({ access_token: token });

        await fetchProfile();

      }

      return { error: null };

    } catch (error) {

      console.error("Signup error:", error);

      return { error };

    }

  };

  /* ------------------------------------------------ */
  /* SIGNIN */
/* ------------------------------------------------ */

  const signIn = async (
    email: string,
    password: string
  ) => {

    try {

      const res = await api.post("/auth/login", {
        email,
        password
      });

      const data = res?.data ?? res;

      if (data?.session?.access_token) {

        const token = data.session.access_token;

        localStorage.setItem(TOKEN_KEY, token);

        setSession({ access_token: token });

        await fetchProfile();

      }

      return { error: null };

    } catch (error) {

      console.error("Login error:", error);

      return { error };

    }

  };

  /* ------------------------------------------------ */
  /* LOGOUT */
/* ------------------------------------------------ */

  const signOut = async () => {

    localStorage.removeItem(TOKEN_KEY);

    setUser(null);
    setProfile(null);
    setSession(null);

  };

  /* ------------------------------------------------ */
  /* PROVIDER */
/* ------------------------------------------------ */

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

/* ------------------------------------------------ */
/* HOOK */
/* ------------------------------------------------ */

export const useAuth = () => useContext(AuthContext);