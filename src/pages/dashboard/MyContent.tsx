// src/pages/dashboard/MyContent.tsx
import { useState } from "react";
import { useAuth } from "@/lib/auth";

import DashboardLayout from "@/components/DashboardLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

import { Plus, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";

import { uploadVideo } from "@/services/upload.service";
import { libraryService } from "@/services/library.service";
import { useMyContent } from "@/hooks/useMyContent";

const categories = [
  "beauty",
  "fashion",
  "food",
  "tech",
  "lifestyle",
  "fitness",
  "education",
  "travel"
] as const;

const MyContent = () => {

  const { profile } = useAuth();

  const queryClient = useQueryClient();

  const { data: items, isLoading } = useMyContent();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "beauty",
    price: "",
    license: "standard"
  });

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const uploadContent = async () => {

    if (!file || !profile) return;

    try {

      setLoading(true);

      const videoUrl = await uploadVideo(file);

      await libraryService.createContent({
        title: form.title,
        category: form.category,
        license: form.license,
        price: Number(form.price),
        video_url: videoUrl
      });

      toast.success("Content uploaded");

      queryClient.invalidateQueries({
        queryKey: ["my-content"]
      });

      setDialogOpen(false);

      setFile(null);

      setForm({
        title: "",
        category: "beauty",
        price: "",
        license: "standard"
      });

    } catch (err: any) {

      toast.error(err.message);

    } finally {

      setLoading(false);

    }

  };

  const deleteContent = async (id: string) => {

    try {

      await libraryService.deleteContent(id);

      toast.success("Content deleted");

      queryClient.invalidateQueries({
        queryKey: ["my-content"]
      });

    } catch {

      toast.error("Delete failed");

    }

  };

  return (

    <DashboardLayout title="My Content Library">

      <div className="flex justify-between items-center mb-6">

        <p className="text-muted-foreground">
          {items?.length || 0} items
        </p>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

          <DialogTrigger asChild>

            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Upload Content
            </Button>

          </DialogTrigger>

          <DialogContent>

            <DialogHeader>
              <DialogTitle>Upload Content for Sale</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div>

                <Label>Category</Label>

                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      category: v
                    })
                  }
                >

                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>

                    {categories.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="capitalize"
                      >
                        {c}
                      </SelectItem>
                    ))}

                  </SelectContent>

                </Select>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>

                  <Label>License</Label>

                  <Select
                    value={form.license}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        license: v
                      })
                    }
                  >

                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="standard">
                        Standard
                      </SelectItem>

                      <SelectItem value="extended">
                        Extended
                      </SelectItem>

                      <SelectItem value="exclusive">
                        Exclusive
                      </SelectItem>

                    </SelectContent>

                  </Select>

                </div>

              </div>

              <div>

                <Label>Video File</Label>

                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                  className="mt-1"
                />

              </div>

              <Button
                onClick={uploadContent}
                disabled={!file || !form.title || loading}
                className="w-full"
              >

                {loading ? "Uploading..." : "Upload"}

              </Button>

            </div>

          </DialogContent>

        </Dialog>

      </div>

      {isLoading && (
        <p className="text-center py-12 text-muted-foreground">
          Loading content...
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {items?.map((item: any) => (

          <Card key={item.id} className="overflow-hidden">

            <div className="aspect-video bg-muted">

              <video
                src={item.video_url}
                className="w-full h-full object-cover"
                controls
              />

            </div>

            <CardContent className="pt-4">

              <h3 className="font-display font-semibold mb-1">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 mb-3">

                <Badge
                  variant="secondary"
                  className="capitalize"
                >
                  {item.category}
                </Badge>

                <Badge
                  variant="outline"
                  className="capitalize"
                >
                  {item.license}
                </Badge>

              </div>

              <div className="flex items-center justify-between">

                <span className="font-display font-bold text-primary">
                  ${item.price}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteContent(item.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

      {!isLoading && items?.length === 0 && (
        <p className="text-center text-muted-foreground py-16">
          No content yet. Upload videos to sell!
        </p>
      )}

    </DashboardLayout>

  );

};

export default MyContent;