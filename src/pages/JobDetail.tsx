// src/pages/JobDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, DollarSign, Video, Briefcase, Send, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { profile } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [proposalMessage, setProposalMessage] = useState("");
  const [priceOffer, setPriceOffer] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isCreator = profile?.role === "creator";
  const isBrand = profile?.role === "brand";
  const isBrandOwner = job?.brand_id === profile?.id;

  const loadData = async () => {
    if (!jobId) return;
    const [jobRes, proposalsRes, submissionsRes] = await Promise.all([
      supabase.from("jobs").select("*, profiles!jobs_brand_id_fkey(name, company_name, avatar_url)").eq("id", jobId).single(),
      supabase.from("proposals").select("*, profiles!proposals_creator_id_fkey(name, avatar_url, rating, city)").eq("job_id", jobId).order("created_at", { ascending: false }),
      supabase.from("submissions").select("*, profiles!submissions_creator_id_fkey(name)").eq("job_id", jobId).order("created_at", { ascending: false }),
    ]);
    setJob(jobRes.data);
    setProposals(proposalsRes.data || []);
    setSubmissions(submissionsRes.data || []);
  };

  useEffect(() => { loadData(); }, [jobId]);

  const submitProposal = async () => {
    if (!profile || !jobId) return;
    setLoading(true);
    const { error } = await supabase.from("proposals").insert({
      job_id: jobId,
      creator_id: profile.id,
      message: proposalMessage,
      price_offer: parseFloat(priceOffer) || null,
      delivery_time: parseInt(deliveryTime) || null,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Proposal submitted!");
      setDialogOpen(false);
      setProposalMessage("");
      setPriceOffer("");
      setDeliveryTime("");
      loadData();
    }
  };

  const updateProposal = async (proposalId: string, status: "accepted" | "rejected") => {
    const { error } = await supabase.from("proposals").update({ status }).eq("id", proposalId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Proposal ${status}`);
      if (status === "accepted") {
        await supabase.from("jobs").update({ status: "in_progress" }).eq("id", jobId);
      }
      loadData();
    }
  };

  const updateSubmission = async (submissionId: string, status: "approved" | "revision_requested", feedback?: string) => {
    const { error } = await supabase.from("submissions").update({ status, feedback }).eq("id", submissionId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Submission ${status === "approved" ? "approved" : "revision requested"}`);
      if (status === "approved") {
        await supabase.from("jobs").update({ status: "completed" }).eq("id", jobId);
      }
      loadData();
    }
  };

  if (!job) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const statusColors: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Job Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}>{job.status}</span>
            </div>
            <p className="text-muted-foreground mb-4">by {(job.profiles as any)?.company_name || (job.profiles as any)?.name}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              {job.platform && <span className="flex items-center gap-1"><Video className="w-4 h-4" />{job.platform}</span>}
              {(job.budget_min || job.budget_max) && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${job.budget_min || 0} - ${job.budget_max || 0}</span>}
              {job.videos_required && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.videos_required} videos</span>}
              {job.deadline && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(job.deadline).toLocaleDateString()}</span>}
            </div>
            {job.description && <p className="text-sm leading-relaxed">{job.description}</p>}
          </div>

          {/* Creator: Submit Proposal */}
          {isCreator && job.status === "open" && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mb-8 gap-2"><Send className="w-4 h-4" /> Submit Proposal</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Submit Proposal</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Message</Label>
                    <Textarea value={proposalMessage} onChange={(e) => setProposalMessage(e.target.value)} placeholder="Why are you a great fit for this job?" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price Offer ($)</Label>
                      <Input type="number" value={priceOffer} onChange={(e) => setPriceOffer(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label>Delivery Time (days)</Label>
                      <Input type="number" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="mt-1" />
                    </div>
                  </div>
                  <Button onClick={submitProposal} disabled={loading} className="w-full">
                    {loading ? "Submitting..." : "Submit Proposal"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Proposals (visible to brand owner) */}
          {isBrandOwner && proposals.length > 0 && (
            <Card className="mb-8">
              <CardHeader><CardTitle>Proposals ({proposals.length})</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposals.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{(p.profiles as any)?.name || "Creator"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{p.message || "—"}</TableCell>
                        <TableCell>${p.price_offer || "—"}</TableCell>
                        <TableCell>{p.delivery_time ? `${p.delivery_time}d` : "—"}</TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{p.status}</Badge></TableCell>
                        <TableCell>
                          {p.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => updateProposal(p.id, "accepted")}><Check className="w-4 h-4 text-green-600" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => updateProposal(p.id, "rejected")}><X className="w-4 h-4 text-destructive" /></Button>
                            </div>
                          )}
                          {p.status === "accepted" && (
                            <Link to={`/dashboard/messages/${jobId}`}>
                              <Button size="sm" variant="outline">Chat</Button>
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Submissions */}
          {(isBrandOwner || isCreator) && submissions.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Submissions</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{(s.profiles as any)?.name || "Creator"}</TableCell>
                        <TableCell>
                          <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View File</a>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{s.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell>
                          {isBrandOwner && s.status === "submitted" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => updateSubmission(s.id, "approved")}><Check className="w-4 h-4 text-green-600" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => updateSubmission(s.id, "revision_requested")}><X className="w-4 h-4 text-destructive" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetail;
