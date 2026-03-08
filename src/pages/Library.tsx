import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockContent = [
  { id: 1, title: "Skincare Routine Morning", creator: "Nilufar K.", category: "Beauty", price: 25, license: "Standard" },
  { id: 2, title: "Phone Unboxing Reaction", creator: "Jasur M.", category: "Tech", price: 30, license: "Standard" },
  { id: 3, title: "OOTD Spring Collection", creator: "Madina R.", category: "Fashion", price: 35, license: "Extended" },
  { id: 4, title: "Street Food Tour Tashkent", creator: "Otabek S.", category: "Food", price: 20, license: "Standard" },
  { id: 5, title: "Home Workout Routine", creator: "Bekzod A.", category: "Fitness", price: 28, license: "Standard" },
  { id: 6, title: "Apartment Tour Vlog", creator: "Zarina T.", category: "Lifestyle", price: 22, license: "Standard" },
];

const Library = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Content Library</h1>
        <p className="text-muted-foreground mb-8">Browse and purchase ready-made UGC videos</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockContent.map((item) => (
            <div key={item.id} className="rounded-2xl bg-surface border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group">
              <div className="aspect-video bg-muted relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">by {item.creator}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant="outline">{item.license}</Badge>
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
      </div>
      <Footer />
    </div>
  );
};

export default Library;
