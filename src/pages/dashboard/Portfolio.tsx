// src/pages/dashboard/Portfolio.tsx
import { useState } from "react";
import { useAuth } from "@/lib/auth";

import DashboardLayout from "@/components/DashboardLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { Plus, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";

import { uploadVideo } from "@/services/upload.service";
import { portfolioService } from "@/services/portfolio.service";
import { usePortfolio } from "@/hooks/usePortfolio";

const Portfolio = () => {

  const { profile } = useAuth();

  const queryClient = useQueryClient();

  const { data: items, isLoading } = usePortfolio();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [description, setDescription] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const uploadItem = async () => {

    if (!file || !profile) return;

    if ((items?.length || 0) >= 10) {
      toast.error("Maximum 10 portfolio items");
      return;
    }

    try {

      setLoading(true);

      const videoUrl = await uploadVideo(file);

      await portfolioService.createItem({
        video_url: videoUrl,
        description
      });

      toast.success("Portfolio item added");

      queryClient.invalidateQueries({
        queryKey: ["portfolio"]
      });

      setDialogOpen(false);
      setFile(null);
      setDescription("");

    } catch (err: any) {

      toast.error(err.message);

    } finally {

      setLoading(false);

    }

  };

  const deleteItem = async (id: string) => {

    try {

      await portfolioService.deleteItem(id);

      toast.success("Item deleted");

      queryClient.invalidateQueries({
        queryKey: ["portfolio"]
      });

    } catch {

      toast.error("Delete failed");

    }

  };

  return (

    <DashboardLayout title="Portfolio">

      <div className="flex justify-between items-center mb-6">

        <p className="text-muted-foreground">
          {items?.length || 0}/10 items
        </p>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

          <DialogTrigger asChild>

            <Button
              className="gap-2"
              disabled={(items?.length || 0) >= 10}
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>

          </DialogTrigger>

          <DialogContent>

            <DialogHeader>
              <DialogTitle>Add Portfolio Item</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

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

              <div>
                <Label>Description</Label>

                <Textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <Button
                onClick={uploadItem}
                disabled={!file || loading}
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
          Loading portfolio...
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

              <p className="text-sm text-muted-foreground mb-3">
                {item.description || "No description"}
              </p>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteItem(item.id)}
                className="text-destructive"
              >

                <Trash2 className="w-4 h-4 mr-1" />

                Delete

              </Button>

            </CardContent>

          </Card>

        ))}

      </div>

      {!isLoading && items?.length === 0 && (
        <p className="text-center text-muted-foreground py-16">
          No portfolio items yet. Upload your best work!
        </p>
      )}

    </DashboardLayout>

  );

};

export default Portfolio;