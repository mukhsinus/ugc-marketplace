import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, DollarSign, TrendingUp, Ban, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [commission, setCommission] = useState("15");
  const [stats, setStats] = useState({ creators: 0, brands: 0, jobs: 0, completedJobs: 0 });

  const loadData = async () => {
    const [profilesRes, jobsRes, settingsRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("jobs").select("*, profiles!jobs_brand_id_fkey(name, company_name)").order("created_at", { ascending: false }),
      supabase.from("platform_settings").select("*").eq("key", "commission_rate").single(),
    ]);

    const profiles = profilesRes.data || [];
    const allJobs = jobsRes.data || [];
    setUsers(profiles);
    setJobs(allJobs);
    if (settingsRes.data) setCommission(settingsRes.data.value);
    setStats({
      creators: profiles.filter((p: any) => p.role === "creator").length,
      brands: profiles.filter((p: any) => p.role === "brand").length,
      jobs: allJobs.length,
      completedJobs: allJobs.filter((j: any) => j.status === "completed").length,
    });
  };

  useEffect(() => { loadData(); }, []);

  const toggleBan = async (userId: string, currentBan: boolean) => {
    await supabase.from("profiles").update({ is_banned: !currentBan }).eq("id", userId);
    toast.success(currentBan ? "User unbanned" : "User banned");
    loadData();
  };

  const deleteJob = async (jobId: string) => {
    await supabase.from("jobs").delete().eq("id", jobId);
    toast.success("Job deleted");
    loadData();
  };

  const updateCommission = async () => {
    await supabase.from("platform_settings").update({ value: commission }).eq("key", "commission_rate");
    toast.success("Commission updated");
  };

  return (
    <DashboardLayout title="Admin Panel">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Creators</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.creators}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Brands</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.brands}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jobs Posted</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.jobs}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.completedJobs}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

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
                      <TableCell className="font-medium">{user.name || user.company_name || "—"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell><Badge variant="secondary" className="capitalize">{user.role}</Badge></TableCell>
                      <TableCell>{user.city || "—"}</TableCell>
                      <TableCell>
                        {user.is_banned ? <Badge variant="destructive">Banned</Badge> : <Badge variant="outline">Active</Badge>}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleBan(user.id, user.is_banned)}>
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
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{(job.profiles as any)?.company_name || (job.profiles as any)?.name || "—"}</TableCell>
                      <TableCell><Badge variant="secondary" className="capitalize">{job.status}</Badge></TableCell>
                      <TableCell>${job.budget_min || 0} - ${job.budget_max || 0}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => deleteJob(job.id)}>
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

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm space-y-4">
                <div>
                  <Label htmlFor="commission">Platform Commission (%)</Label>
                  <Input id="commission" type="number" min="0" max="50" value={commission} onChange={(e) => setCommission(e.target.value)} className="mt-1" />
                </div>
                <Button onClick={updateCommission}>Save Commission</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
