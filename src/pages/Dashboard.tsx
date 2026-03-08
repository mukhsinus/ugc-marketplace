import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import CreatorDashboard from "@/components/dashboard/CreatorDashboard";
import BrandDashboard from "@/components/dashboard/BrandDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  if (profile.role === "admin") return <AdminDashboard />;
  if (profile.role === "brand") return <BrandDashboard />;
  return <CreatorDashboard />;
};

export default Dashboard;
