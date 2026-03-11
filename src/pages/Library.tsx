// src/pages/Library.tsx
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const categories = ["All", "beauty", "fashion", "food", "tech", "lifestyle", "fitness", "education", "travel"];

const Library = () => {
  const [items, setItems] = useState<any[]>([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const load = async () => {
      let query = supabase.from("content_library").select("*, profiles!content_library_creator_id_fkey(name)").eq("is_active", true);
      if (category !== "All") query = query.eq("category", category as any);
      const { data } = await query.order("created_at", { ascending: false });
      setItems(data || []);
    };
    load();
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Content Library</h1>
            <p className="text-muted-foreground">Browse and purchase ready-made UGC videos</p>
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-surface border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group">
              <div className="aspect-video bg-muted relative flex items-center justify-center">
                {item.video_url ? (
                  <video src={item.video_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">by {(item.profiles as any)?.name || "Creator"}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="capitalize">{item.category}</Badge>
                    <Badge variant="outline" className="capitalize">{item.license}</Badge>
                  </div>
                  <span className="font-display font-bold text-primary">${item.price}</span>
                </div>
                <Button className="w-full mt-4 gap-2" size="sm">
                  <ShoppingCart className="w-4 h-4" /> Purchase
                </Button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No content available yet. Check back soon!</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Library;
