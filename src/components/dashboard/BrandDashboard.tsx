// src/components/dashboard/BrandDashboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, Users } from "lucide-react";
import { api } from "@/lib/api";

type Stats = {
  jobs: number;
  activeJobs: number;
  proposals: number;
};

const BrandDashboard = () => {

  const { profile } = useAuth();

  const [stats, setStats] = useState<Stats>({
    jobs: 0,
    activeJobs: 0,
    proposals: 0
  });

  useEffect(() => {

    if (!profile) return;

    const load = async () => {

      try {

        const response = await api.get("/dashboard/brand");

        const data = response.data ?? response;

        setStats({
          jobs: data.jobs || 0,
          activeJobs: data.activeJobs || 0,
          proposals: data.proposals || 0
        });

      } catch (err) {

        console.error("Dashboard load error:", err);

      }

    };

    load();

  }, [profile]);

  return (
    <DashboardLayout title="Brand Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Jobs
            </CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {stats.jobs}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Jobs
            </CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeJobs}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Received Proposals
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {stats.proposals}
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="flex gap-4">

        <Link to="/dashboard/my-jobs">
          <Button>Manage Jobs</Button>
        </Link>

        <Link to="/creators">
          <Button variant="outline">Browse Creators</Button>
        </Link>

        <Link to="/library">
          <Button variant="outline">Content Library</Button>
        </Link>

      </div>

    </DashboardLayout>
  );

};

export default BrandDashboard;