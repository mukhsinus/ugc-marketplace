import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const BrandJobs = () => {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", platform: "TikTok", content_type: "", budget_min: "", budget_max: "", videos_required: "1", deadline: "" });
  const [loading, setLoading] = useState(false);

  const loadJobs = async () => {
    if (!profile) return;
    const { data } = await supabase.from("jobs").select("*").eq("brand_id", profile.id).order("created_at", { ascending: false });
    setJobs(data || []);
  };

  useEffect(() => { loadJobs(); }, [profile]);

  const createJob = async () => {
    if (!profile || !form.title.trim()) { toast.error("Title is required"); return; }
    // Check limit: max 10 active jobs
    const activeJobs = jobs.filter(j => j.status === "open" || j.status === "in_progress");
    if (activeJobs.length >= 10) { toast.error("Maximum 10 active jobs allowed"); return; }
    
    setLoading(true);
    const { error } = await supabase.from("jobs").insert({
      brand_id: profile.id,
      title: form.title,
      description: form.description,
      platform: form.platform,
      content_type: form.content_type,
      budget_min: parseFloat(form.budget_min) || null,
      budget_max: parseFloat(form.budget_max) || null,
      videos_required: parseInt(form.videos_required) || 1,
      deadline: form.deadline || null,
    });
    setLoading(false);
    if (error) { toast.error(error.message); } else {
      toast.success("Job created!");
      setDialogOpen(false);
      setForm({ title: "", description: "", platform: "TikTok", content_type: "", budget_min: "", budget_max: "", videos_required: "1", deadline: "" });
      loadJobs();
    }
  };

  return (
    <DashboardLayout title="My Jobs">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{jobs.length} jobs total</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Create Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create New Job</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Platform</Label>
                  <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Content Type</Label><Input value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })} placeholder="Product Review" className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Min Budget ($)</Label><Input type="number" value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: e.target.value })} className="mt-1" /></div>
                <div><Label>Max Budget ($)</Label><Input type="number" value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: e.target.value })} className="mt-1" /></div>
                <div><Label>Videos</Label><Input type="number" value={form.videos_required} onChange={(e) => setForm({ ...form, videos_required: e.target.value })} className="mt-1" /></div>
              </div>
              <div><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="mt-1" /></div>
              <Button onClick={createJob} disabled={loading} className="w-full">{loading ? "Creating..." : "Create Job"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.platform || "—"}</TableCell>
                  <TableCell>${job.budget_min || 0} - ${job.budget_max || 0}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{job.status}</Badge></TableCell>
                  <TableCell>
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {jobs.length === 0 && <p className="text-center text-muted-foreground py-8">No jobs yet. Create your first job!</p>}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default BrandJobs;
