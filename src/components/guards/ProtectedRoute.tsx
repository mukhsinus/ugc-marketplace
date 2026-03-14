// src/components/guards/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {

  const { user, profile, loading } = useAuth();
  const location = useLocation();

  /* -------------------------------- */
  /* LOADING STATE                    */
  /* -------------------------------- */

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading session...
          </p>
        </div>
      </div>
    );

  }

  /* -------------------------------- */
  /* NOT AUTHENTICATED                */
  /* -------------------------------- */

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );

  }

  /* -------------------------------- */
  /* BANNED USER                      */
  /* -------------------------------- */

  if (profile?.is_banned) {

    return (
      <Navigate
        to="/banned"
        replace
      />
    );

  }

  /* -------------------------------- */
  /* ALLOW ACCESS                     */
  /* -------------------------------- */

  return <>{children}</>;

}