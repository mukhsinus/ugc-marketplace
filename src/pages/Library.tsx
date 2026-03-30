// src/pages/Library.tsx
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

type LibraryItem = {
  id: string;
  title: string;
  video_url?: string | null;
  category?: string;
  license?: string;
  price?: number;
  creatorName?: string | null;
};

const categories = [
  "library.category.all",
  "library.category.beauty",
  "library.category.fashion",
  "library.category.food",
  "library.category.tech",
  "library.category.lifestyle",
  "library.category.fitness",
  "library.category.education",
  "library.category.travel",
];

const categoryValues = [
  "All",
  "beauty",
  "fashion",
  "food",
  "tech",
  "lifestyle",
  "fitness",
  "education",
  "travel",
];

const Library = () => {
  const { t } = useI18n();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/library?category=${encodeURIComponent(category)}`
        );

        const data = res?.data ?? res ?? [];

        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Library load error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category]);

  return (
    <div className="flex flex-col min-h-screen bg-background">

      <Navbar />

      <main className="flex-1">

        <div className="container mx-auto px-4 pt-24 pb-16">

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t("library.title")}
            </h1>

            <p className="text-muted-foreground">
              {t("library.subtitle")}
            </p>
          </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>

            <SelectContent>
              {categories.map((cat, idx) => (
                <SelectItem key={cat} value={categoryValues[idx]} className="capitalize">
                  {t(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          </div>

          {loading ? (

          <div className="text-center py-16 text-muted-foreground">
            {t("library.loading")}
          </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {items.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl bg-surface border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
                >

                  <div className="aspect-video bg-muted relative flex items-center justify-center">

                    {item.video_url ? (
                      <video
                        src={item.video_url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="w-6 h-6 text-primary" />
                    )}

                  </div>

                  <div className="p-5">

                    <h3 className="font-semibold mb-1">
                      {item.title}
                    </h3>

                  <p className="text-sm text-muted-foreground mb-3">
                    by {item.creatorName ?? t("library.creator.default")}
                  </p>

                    <div className="flex items-center justify-between">

                      <div className="flex gap-2">

                        {item.category && (
                          <Badge variant="secondary" className="capitalize">
                            {item.category}
                          </Badge>
                        )}

                        {item.license && (
                          <Badge variant="outline" className="capitalize">
                            {item.license}
                          </Badge>
                        )}

                      </div>

                      <span className="font-bold text-primary">
                        ${item.price ?? 0}
                      </span>

                    </div>

                  <Button className="w-full mt-4 gap-2" size="sm">
                    <ShoppingCart className="w-4 h-4" />
                    {t("library.purchase")}
                  </Button>

                  </div>

                </div>

              ))}

            </div>

          )}

        {!loading && items.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            {t("library.nodata")}
          </p>
        )}

        </div>

      </main>

      <Footer />

    </div>
  );
};

export default Library;