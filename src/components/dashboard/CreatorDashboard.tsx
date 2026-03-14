// src/components/dashboard/CreatorDashboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, Star } from "lucide-react";

type Stats = {
  proposals: number;
  activeJobs: number;
  messages: number;
};

const CreatorDashboard = () => {

  const { profile } = useAuth();

  const [stats, setStats] = useState<Stats>({
    proposals: 0,
    activeJobs: 0,
    messages: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!profile) return;

    const load = async () => {

      try {

        const res = await api.get("/dashboard/creator");

        const data = res?.data ?? res ?? {};

        setStats({
          proposals: data.proposals ?? 0,
          activeJobs: data.activeJobs ?? 0,
          messages: data.messages ?? 0
        });

      } catch (err) {

        console.error("Creator dashboard load error:", err);

      } finally {

        setLoading(false);

      }

    };

    load();

  }, [profile]);

  return (
    <DashboardLayout title="Creator Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium text-muted-foreground">
              My Proposals
            </CardTitle>

            <Briefcase className="w-4 h-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : stats.proposals}
            </div>
          </CardContent>

        </Card>

        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Jobs
            </CardTitle>

            <Star className="w-4 h-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : stats.activeJobs}
            </div>
          </CardContent>

        </Card>

        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rating
            </CardTitle>

            <Star className="w-4 h-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">
              {profile?.rating ?? "N/A"}
            </div>

            <p className="text-xs text-muted-foreground">
              {profile?.review_count ?? 0} reviews
            </p>

          </CardContent>

        </Card>

      </div>

      <div className="flex gap-4">

        <Link to="/jobs">
          <Button>
            Browse Jobs
          </Button>
        </Link>

        <Link to="/dashboard/portfolio">
          <Button variant="outline">
            Manage Portfolio
          </Button>
        </Link>

        <Link to="/dashboard/my-content">
          <Button variant="outline">
            Content Library
          </Button>
        </Link>

      </div>

    </DashboardLayout>
  );

};

export default CreatorDashboard;