// src/components/guards/RoleGuard.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

type Role = "admin" | "creator" | "brand";

type Props = {
  children: ReactNode;
  allowedRoles: Role[];
};

export default function RoleGuard({
  children,
  allowedRoles
}: Props) {

  const { profile, loading } = useAuth();

  /* -------------------------------- */
  /* WAIT PROFILE                     */
  /* -------------------------------- */

  if (loading) {
    return null;
  }

  /* -------------------------------- */
  /* NO PROFILE (SHOULD NOT HAPPEN)   */
  /* -------------------------------- */

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  /* -------------------------------- */
  /* BANNED USER                      */
  /* -------------------------------- */

  if (profile.is_banned) {
    return <Navigate to="/banned" replace />;
  }

  /* -------------------------------- */
  /* ROLE CHECK                       */
  /* -------------------------------- */

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  /* -------------------------------- */
  /* ACCESS GRANTED                   */
  /* -------------------------------- */

  return <>{children}</>;

}