// src/pages/JobDetail.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import {
  Calendar,
  DollarSign,
  Video,
  Briefcase,
  Send,
  Check,
  X
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { toast } from "sonner";

import { useJob } from "@/hooks/useJobs";
import {
  useProposals,
  useCreateProposal,
  useUpdateProposalStatus
} from "@/hooks/useProposals";

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-100 text-red-700",
};

export default function JobDetail() {

  const { jobId } = useParams<{ jobId: string }>();
  const { profile } = useAuth();

  const { data: job, isLoading } = useJob(jobId!);
  const { data: proposals } = useProposals(jobId!);

  const createProposal = useCreateProposal(jobId!);
  const updateProposal = useUpdateProposalStatus(jobId!);

  const [proposalMessage, setProposalMessage] = useState("");
  const [priceOffer, setPriceOffer] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const isCreator = profile?.role === "creator";
  const isBrandOwner = job?.brand_id === profile?.id;

  const submitProposal = () => {

    createProposal.mutate(
      {
        message: proposalMessage,
        price_offer: priceOffer ? parseFloat(priceOffer) : undefined,
        delivery_time: deliveryTime ? parseInt(deliveryTime) : undefined
      },
      {
        onSuccess: () => {
          toast.success("Proposal submitted");
          setDialogOpen(false);
          setProposalMessage("");
          setPriceOffer("");
          setDeliveryTime("");
        },
        onError: () => toast.error("Failed to submit proposal")
      }
    );

  };

  const handleProposalUpdate = (
    proposalId: string,
    status: "accepted" | "rejected"
  ) => {

    updateProposal.mutate(
      { proposalId, status },
      {
        onSuccess: () => toast.success(`Proposal ${status}`)
      }
    );

  };

  if (isLoading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-background">

      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">

        <div className="max-w-4xl mx-auto">

          {/* Job Header */}

          <div className="mb-8">

            <div className="flex items-center gap-3 mb-2">

              <h1 className="text-2xl md:text-3xl font-bold">
                {job.title}
              </h1>

              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}
              >
                {job.status}
              </span>

            </div>

            <p className="text-muted-foreground mb-4">
              by {job.brand?.company_name || job.brand?.name || "Brand"}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">

              {job.platform && (
                <span className="flex items-center gap-1">
                  <Video className="w-4 h-4"/>
                  {job.platform}
                </span>
              )}

              {(job.budget_min || job.budget_max) && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4"/>
                  ${job.budget_min || 0} - ${job.budget_max || 0}
                </span>
              )}

              {job.videos_required && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4"/>
                  {job.videos_required} videos
                </span>
              )}

              {job.deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4"/>
                  {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}

            </div>

            {job.description && (
              <p className="text-sm leading-relaxed">
                {job.description}
              </p>
            )}

          </div>

          {/* Submit proposal */}

          {isCreator && job.status === "open" && (

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

              <DialogTrigger asChild>
                <Button className="mb-8 gap-2">
                  <Send className="w-4 h-4"/>
                  Submit Proposal
                </Button>
              </DialogTrigger>

              <DialogContent>

                <DialogHeader>
                  <DialogTitle>Submit Proposal</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={proposalMessage}
                      onChange={(e) => setProposalMessage(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <Label>Price Offer</Label>
                      <Input
                        type="number"
                        value={priceOffer}
                        onChange={(e) => setPriceOffer(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Delivery Time</Label>
                      <Input
                        type="number"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                      />
                    </div>

                  </div>

                  <Button
                    className="w-full"
                    onClick={submitProposal}
                    disabled={createProposal.isPending}
                  >
                    Submit Proposal
                  </Button>

                </div>

              </DialogContent>

            </Dialog>

          )}

          {/* Proposals */}

          {isBrandOwner && proposals?.length ? (

            <Card>

              <CardHeader>
                <CardTitle>
                  Proposals ({proposals.length})
                </CardTitle>
              </CardHeader>

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

                    {proposals.map((p: any) => (

                      <TableRow key={p.id}>

                        <TableCell>
                          {p.creator?.name || "Creator"}
                        </TableCell>

                        <TableCell className="max-w-[200px] truncate">
                          {p.message || "—"}
                        </TableCell>

                        <TableCell>
                          ${p.price_offer || "—"}
                        </TableCell>

                        <TableCell>
                          {p.delivery_time
                            ? `${p.delivery_time}d`
                            : "—"}
                        </TableCell>

                        <TableCell>
                          <Badge variant="secondary">
                            {p.status}
                          </Badge>
                        </TableCell>

                        <TableCell>

                          {p.status === "pending" && (

                            <div className="flex gap-1">

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleProposalUpdate(
                                    p.id,
                                    "accepted"
                                  )
                                }
                              >
                                <Check className="w-4 h-4 text-green-600"/>
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleProposalUpdate(
                                    p.id,
                                    "rejected"
                                  )
                                }
                              >
                                <X className="w-4 h-4 text-destructive"/>
                              </Button>

                            </div>

                          )}

                          {p.status === "accepted" && (
                            <Link to={`/dashboard/messages/${jobId}`}>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                Chat
                              </Button>
                            </Link>
                          )}

                        </TableCell>

                      </TableRow>

                    ))}

                  </TableBody>

                </Table>

              </CardContent>

            </Card>

          ) : null}

        </div>

      </div>

      <Footer />

    </div>

  );

}