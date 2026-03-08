import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

const Portfolio = () => {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    if (!profile) return;
    const { data } = await supabase.from("portfolio").select("*").eq("creator_id", profile.id).order("created_at", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { loadItems(); }, [profile]);

  const uploadItem = async () => {
    if (!file || !user || !profile) return;
    if (items.length >= 10) { toast.error("Maximum 10 portfolio items"); return; }

    setLoading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, file);
    if (uploadError) { setLoading(false); toast.error("Upload failed"); return; }

    const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(filePath);

    const { error } = await supabase.from("portfolio").insert({
      creator_id: profile.id,
      video_url: publicUrl,
      description,
    });
    setLoading(false);
    if (error) { toast.error(error.message); } else {
      toast.success("Portfolio item added!");
      setDialogOpen(false);
      setFile(null);
      setDescription("");
      loadItems();
    }
  };

  const deleteItem = async (id: string) => {
    await supabase.from("portfolio").delete().eq("id", id);
    toast.success("Item deleted");
    loadItems();
  };

  return (
    <DashboardLayout title="Portfolio">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{items.length}/10 items</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={items.length >= 10}><Plus className="w-4 h-4" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Portfolio Item</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Video File</Label>
                <Input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
              </div>
              <Button onClick={uploadItem} disabled={loading || !file} className="w-full">
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center relative">
              <video src={item.video_url} className="w-full h-full object-cover" controls />
            </div>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">{item.description || "No description"}</p>
              <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-muted-foreground py-16">No portfolio items yet. Upload your best work!</p>
      )}
    </DashboardLayout>
  );
};

export default Portfolio;
