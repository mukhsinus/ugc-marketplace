import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Calendar, DollarSign, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockJobs = [
  { id: 1, title: "TikTok Product Review Videos", brand: "TechZone UZ", platform: "TikTok", budget: "$200-500", videos: 5, deadline: "2026-04-01", status: "open", type: "Product Review" },
  { id: 2, title: "Instagram Reels for Fashion Brand", brand: "Silk Road Fashion", platform: "Instagram", budget: "$300-600", videos: 3, deadline: "2026-03-25", status: "open", type: "Fashion" },
  { id: 3, title: "Food Review UGC Content", brand: "Plov House", platform: "TikTok", budget: "$100-250", videos: 4, deadline: "2026-04-10", status: "open", type: "Food" },
  { id: 4, title: "Beauty Product Unboxing", brand: "GlowUp UZ", platform: "Instagram", budget: "$150-400", videos: 3, deadline: "2026-03-30", status: "open", type: "Beauty" },
];

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-muted text-muted-foreground",
};

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Job Board</h1>
        <p className="text-muted-foreground mb-8">Browse UGC campaigns from top brands</p>

        <div className="space-y-4">
          {mockJobs.map((job) => (
            <div key={job.id} className="rounded-2xl bg-surface border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display font-semibold text-lg">{job.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}>{job.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{job.brand}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Video className="w-4 h-4" />{job.platform}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.budget}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.videos} videos</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{job.deadline}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="self-start">{job.type}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
