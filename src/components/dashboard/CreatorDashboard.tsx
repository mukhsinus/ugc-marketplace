import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, MessageSquare, Star, DollarSign } from "lucide-react";

const CreatorDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ proposals: 0, activeJobs: 0, messages: 0 });

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      const [proposals, jobs] = await Promise.all([
        supabase.from("proposals").select("id", { count: "exact" }).eq("creator_id", profile.id),
        supabase.from("proposals").select("id", { count: "exact" }).eq("creator_id", profile.id).eq("status", "accepted"),
      ]);
      setStats({
        proposals: proposals.count || 0,
        activeJobs: jobs.count || 0,
        messages: 0,
      });
    };
    load();
  }, [profile]);

  return (
    <DashboardLayout title="Creator Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Proposals</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.proposals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.rating || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{profile?.review_count || 0} reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Link to="/jobs"><Button>Browse Jobs</Button></Link>
        <Link to="/dashboard/portfolio"><Button variant="outline">Manage Portfolio</Button></Link>
        <Link to="/dashboard/my-content"><Button variant="outline">Content Library</Button></Link>
      </div>
    </DashboardLayout>
  );
};

export default CreatorDashboard;
