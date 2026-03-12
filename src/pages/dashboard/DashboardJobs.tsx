// src/pages/dashboard/DashboardJobs.tsx
import { useJobs } from "@/hooks/useJobs";
import DashboardLayout from "@/components/DashboardLayout";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

import {
  Briefcase,
  DollarSign,
  Calendar,
  Eye
} from "lucide-react";

const DashboardJobs = () => {

  const { data: jobs, isLoading } = useJobs();

  const openJobs = jobs?.filter(
    (j) => j.status === "open"
  ) || [];

  return (

    <DashboardLayout title="Browse Jobs">

      <div className="space-y-4">

        {isLoading && (
          <p className="text-center py-12 text-muted-foreground">
            Loading jobs...
          </p>
        )}

        {openJobs.map((job: any) => (

          <Card
            key={job.id}
            className="hover:border-primary/30 transition-all"
          >

            <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">

              <div className="flex-1">

                <div className="flex items-center gap-3 mb-1">

                  <h3 className="font-display font-semibold">
                    {job.title}
                  </h3>

                  <Badge
                    variant="secondary"
                    className="capitalize"
                  >
                    {job.status}
                  </Badge>

                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {job.brand?.company_name ||
                   job.brand?.name ||
                   "Brand"}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">

                  {job.platform && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {job.platform}
                    </span>
                  )}

                  {(job.budget_min || job.budget_max) && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${job.budget_min || 0} - ${job.budget_max || 0}
                    </span>
                  )}

                  {job.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  )}

                </div>

              </div>

              <Link to={`/jobs/${job.id}`}>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >

                  <Eye className="w-4 h-4" />
                  View

                </Button>

              </Link>

            </CardContent>

          </Card>

        ))}

        {!isLoading && openJobs.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No open jobs at the moment.
          </p>
        )}

      </div>

    </DashboardLayout>

  );

};

export default DashboardJobs;