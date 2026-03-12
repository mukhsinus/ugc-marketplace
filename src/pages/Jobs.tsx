// src/pages/Jobs.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Calendar, DollarSign, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-100 text-red-700",
};

const Jobs = () => {
  const { data: jobs, isLoading } = useJobs();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Job Board
        </h1>

        <p className="text-muted-foreground mb-8">
          Browse UGC campaigns from top brands
        </p>

        {isLoading && (
          <p className="text-center py-16 text-muted-foreground">
            Loading jobs...
          </p>
        )}

        <div className="space-y-4">

          {jobs?.map((job: any) => (
            <Link key={job.id} to={`/jobs/${job.id}`}>

              <div className="rounded-2xl bg-surface border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer mb-4">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  <div className="flex-1">

                    <div className="flex items-center gap-3 mb-2">

                      <h3 className="font-display font-semibold text-lg">
                        {job.title}
                      </h3>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}
                      >
                        {job.status}
                      </span>

                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {job.brand?.company_name || job.brand?.name || "Brand"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">

                      {job.platform && (
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {job.platform}
                        </span>
                      )}

                      {(job.budget_min || job.budget_max) && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${job.budget_min || 0} - ${job.budget_max || 0}
                        </span>
                      )}

                      {job.videos_required && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.videos_required} videos
                        </span>
                      )}

                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      )}

                    </div>

                  </div>

                  {job.content_type && (
                    <Badge variant="secondary">
                      {job.content_type}
                    </Badge>
                  )}

                </div>

              </div>

            </Link>
          ))}

        </div>

        {!isLoading && (!jobs || jobs.length === 0) && (
          <p className="text-center text-muted-foreground py-16">
            No open jobs at the moment. Check back later!
          </p>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default Jobs;