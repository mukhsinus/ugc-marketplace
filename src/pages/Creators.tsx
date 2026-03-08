import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, SlidersHorizontal, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const categories = ["All", "Beauty", "Fashion", "Food", "Tech", "Lifestyle", "Fitness", "Education", "Travel"];
const cities = ["All", "Tashkent", "Samarkand", "Bukhara", "Namangan", "Andijan", "Fergana"];

const mockCreators = [
  { id: 1, name: "Nilufar K.", city: "Tashkent", category: "Beauty", rating: 4.9, reviews: 32, price: 50, avatar: "NK", bio: "Beauty & skincare content creator" },
  { id: 2, name: "Jasur M.", city: "Samarkand", category: "Tech", rating: 4.8, reviews: 28, price: 40, avatar: "JM", bio: "Tech reviewer and unboxing specialist" },
  { id: 3, name: "Madina R.", city: "Tashkent", category: "Fashion", rating: 5.0, reviews: 45, price: 60, avatar: "MR", bio: "Fashion & lifestyle influencer" },
  { id: 4, name: "Otabek S.", city: "Bukhara", category: "Food", rating: 4.7, reviews: 19, price: 35, avatar: "OS", bio: "Food & restaurant content creator" },
  { id: 5, name: "Zarina T.", city: "Tashkent", category: "Lifestyle", rating: 4.6, reviews: 15, price: 45, avatar: "ZT", bio: "Lifestyle and wellness creator" },
  { id: 6, name: "Bekzod A.", city: "Namangan", category: "Fitness", rating: 4.9, reviews: 22, price: 55, avatar: "BA", bio: "Fitness coach and content creator" },
];

const categoryColors: Record<string, string> = {
  Beauty: "bg-pink-100 text-pink-700", Tech: "bg-blue-100 text-blue-700", Fashion: "bg-purple-100 text-purple-700",
  Food: "bg-orange-100 text-orange-700", Lifestyle: "bg-green-100 text-green-700", Fitness: "bg-red-100 text-red-700",
  Education: "bg-yellow-100 text-yellow-700", Travel: "bg-cyan-100 text-cyan-700",
};

const Creators = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All");
  const [sort, setSort] = useState("rating");

  let filtered = mockCreators.filter((c) => {
    if (category !== "All" && c.category !== category) return false;
    if (city !== "All" && c.city !== city) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "price_low") return a.price - b.price;
    if (sort === "price_high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Creator Marketplace</h1>
        <p className="text-muted-foreground mb-8">Find the perfect UGC creator for your brand</p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search creators..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price_low">Price: Low</SelectItem>
              <SelectItem value="price_high">Price: High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((creator) => (
            <div key={creator.id} className="rounded-2xl bg-surface border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
                  {creator.avatar}
                </div>
                <div>
                  <h3 className="font-display font-semibold">{creator.name}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <MapPin className="w-3 h-3" /> {creator.city}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{creator.bio}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[creator.category] || "bg-muted text-muted-foreground"}`}>
                  {creator.category}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{creator.rating}</span>
                  </div>
                  <span className="font-display font-semibold text-primary">${creator.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No creators found matching your criteria.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Creators;
