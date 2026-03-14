// src/pages/Creators.tsx

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Star, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

type Creator = {
  id: string;
  name: string;
  bio?: string;
  city?: string;
  categories?: string[];
  rating?: number;
  review_count?: number;
  price_from?: number;
};

const categories = [
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

const cities = [
  "All",
  "Tashkent",
  "Samarkand",
  "Bukhara",
  "Namangan",
  "Andijan",
  "Fergana",
];

const categoryColors: Record<string, string> = {
  beauty: "bg-pink-100 text-pink-700",
  tech: "bg-blue-100 text-blue-700",
  fashion: "bg-purple-100 text-purple-700",
  food: "bg-orange-100 text-orange-700",
  lifestyle: "bg-green-100 text-green-700",
  fitness: "bg-red-100 text-red-700",
  education: "bg-yellow-100 text-yellow-700",
  travel: "bg-cyan-100 text-cyan-700",
};

const Creators = () => {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All");
  const [sort, setSort] = useState("rating");

  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const load = async () => {

      try {

        setLoading(true);

        const res = await api.get(
          `/creators?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}&sort=${sort}`
        );

        const data = res?.data ?? res ?? [];

        setCreators(Array.isArray(data) ? data : []);

      } catch (err) {

        console.error("Creators load error:", err);
        setCreators([]);

      } finally {

        setLoading(false);

      }

    };

    load();

  }, [category, city, sort]);

  const filtered = search
    ? creators.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase())
      )
    : creators;

  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Creator Marketplace
        </h1>

        <p className="text-muted-foreground mb-8">
          Find the perfect UGC creator for your brand
        </p>

        {/* Filters */}

        <div className="flex flex-col md:flex-row gap-3 mb-8">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              placeholder="Search creators..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price_low">Price: Low</SelectItem>
              <SelectItem value="price_high">Price: High</SelectItem>
              <SelectItem value="new">Newest</SelectItem>
            </SelectContent>
          </Select>

        </div>

        {/* Creators Grid */}

        {loading ? (

          <div className="text-center py-16 text-muted-foreground">
            Loading creators...
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((creator) => (

              <div
                key={creator.id}
                className="rounded-2xl bg-surface border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all"
              >

                <div className="flex items-center gap-4 mb-4">

                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {creator.name?.charAt(0) || "?"}
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {creator.name}
                    </h3>

                    {creator.city && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {creator.city}
                      </div>
                    )}

                  </div>

                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {creator.bio || "UGC Creator"}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">

                  {(creator.categories || []).slice(0, 3).map((cat) => (

                    <span
                      key={cat}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        categoryColors[cat] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </span>

                  ))}

                </div>

                <div className="flex items-center justify-between text-sm">

                  <div className="flex items-center gap-1">

                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />

                    <span className="font-medium">
                      {creator.rating ?? "New"}
                    </span>

                    {(creator.review_count ?? 0) > 0 && (
                      <span className="text-muted-foreground">
                        ({creator.review_count})
                      </span>
                    )}

                  </div>

                  {creator.price_from && (
                    <span className="font-semibold text-primary">
                      from ${creator.price_from}
                    </span>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">
              No creators found.
            </p>
          </div>
        )}

      </div>

      <Footer />

    </div>
  );

};

export default Creators;