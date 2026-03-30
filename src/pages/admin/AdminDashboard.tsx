// src/pages/admin/AdminDashboard.tsx

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, TrendingUp, Ban, Trash2, Settings, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

type User = {
  id: string;
  name?: string;
  company_name?: string;
  email?: string;
  role: string;
  city?: string;
  is_banned: boolean;
};

type Job = {
  id: string;
  title: string;
  brandName?: string;
  status: string;
  budget_min?: number;
  budget_max?: number;
};

type Payout = {
  id: string;
  user_id: string;
  amount: number;
  status: "pending" | "paid" | "rejected";
  created_at?: string;
  profiles?: {
    id: string;
    email?: string;
    role?: string;
  };
};

const AdminDashboard = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [commission, setCommission] = useState("15");

  const [stats, setStats] = useState({
    creators: 0,
    brands: 0,
    jobs: 0,
    completedJobs: 0
  });

  const loadData = async () => {

    try {

      const res = await api.get("/admin/dashboard");

      const data = res?.data ?? res ?? {};

      setUsers(data.users ?? []);
      setJobs(data.jobs ?? []);
      setPayouts(data.payouts ?? []);
      setCommission(String(data.commission ?? "15"));

      setStats({
        creators: data.creators ?? 0,
        brands: data.brands ?? 0,
        jobs: data.jobsCount ?? 0,
        completedJobs: data.completedJobs ?? 0
      });

    } catch (err) {

      console.error("Admin load error:", err);
      toast.error("Failed to load admin data");

    }

  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleBan = async (userId: string, currentBan: boolean) => {

    try {

      await api.patch(`/admin/users/${userId}/ban`, {
        banned: !currentBan
      });

      toast.success(currentBan ? "User unbanned" : "User banned");

      loadData();

    } catch {

      toast.error("Failed to update user");

    }

  };

  const deleteJob = async (jobId: string) => {

    try {

      await api.delete(`/admin/jobs/${jobId}`);

      toast.success("Job deleted");

      loadData();

    } catch {

      toast.error("Failed to delete job");

    }

  };

  const approvePayout = async (payoutId: string) => {

    try {

      await api.patch(`/admin/payouts/${payoutId}/approve`);

      toast.success("Payout approved");

      loadData();

    } catch {

      toast.error("Failed to approve payout");

    }

  };

  const rejectPayout = async (payoutId: string) => {

    try {

      await api.patch(`/admin/payouts/${payoutId}/reject`);

      toast.success("Payout rejected");

      loadData();

    } catch {

      toast.error("Failed to reject payout");

    }

  };

  const updateCommission = async () => {

    try {

      await api.patch("/admin/settings/commission", {
        value: Number(commission)
      });

      toast.success("Commission updated");

    } catch {

      toast.error("Failed to update commission");

    }

  };

  return (
    <DashboardLayout title="Admin Panel">

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Creators
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.creators}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Brands
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.brands}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jobs Posted
            </CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
          </CardContent>
        </Card>

      </div>

      <Tabs defaultValue="users">

        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* USERS */}

        <TabsContent value="users">
          <Card>
            <CardContent className="pt-6">

              <Table>

                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {users.map((user) => (

                    <TableRow key={user.id}>

                      <TableCell className="font-medium">
                        {user.name || user.company_name || "—"}
                      </TableCell>

                      <TableCell>
                        {user.email || "—"}
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {user.city || "—"}
                      </TableCell>

                      <TableCell>
                        {user.is_banned
                          ? <Badge variant="destructive">Banned</Badge>
                          : <Badge variant="outline">Active</Badge>
                        }
                      </TableCell>

                      <TableCell>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBan(user.id, user.is_banned)}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </CardContent>
          </Card>
        </TabsContent>

        {/* JOBS */}

        <TabsContent value="jobs">
          <Card>
            <CardContent className="pt-6">

              <Table>

                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {jobs.map((job) => (

                    <TableRow key={job.id}>

                      <TableCell className="font-medium">
                        {job.title}
                      </TableCell>

                      <TableCell>
                        {job.brandName || "—"}
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {job.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        ${job.budget_min || 0} - ${job.budget_max || 0}
                      </TableCell>

                      <TableCell>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYOUTS */}

        <TabsContent value="payouts">
          <Card>
            <CardContent className="pt-6">
              {payouts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No payouts found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          {payout.profiles?.email || "—"}
                        </TableCell>
                        <TableCell>
                          ${payout.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              payout.status === "paid" 
                                ? "default" 
                                : payout.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payout.created_at
                            ? new Date(payout.created_at).toLocaleDateString()
                            : "—"
                          }
                        </TableCell>
                        <TableCell className="flex gap-2">
                          {payout.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => approvePayout(payout.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => rejectPayout(payout.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS */}

        <TabsContent value="settings">

          <Card>

            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Platform Settings
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="max-w-sm space-y-4">

                <div>

                  <Label htmlFor="commission">
                    Platform Commission (%)
                  </Label>

                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="50"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="mt-1"
                  />

                </div>

                <Button onClick={updateCommission}>
                  Save Commission
                </Button>

              </div>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>

    </DashboardLayout>
  );

};

export default AdminDashboard;