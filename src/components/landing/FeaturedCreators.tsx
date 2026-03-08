import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const mockCreators = [
  { id: 1, name: "Nilufar K.", city: "Tashkent", category: "Beauty", rating: 4.9, reviews: 32, price: "$50", avatar: "NK" },
  { id: 2, name: "Jasur M.", city: "Samarkand", category: "Tech", rating: 4.8, reviews: 28, price: "$40", avatar: "JM" },
  { id: 3, name: "Madina R.", city: "Tashkent", category: "Fashion", rating: 5.0, reviews: 45, price: "$60", avatar: "MR" },
  { id: 4, name: "Otabek S.", city: "Bukhara", category: "Food", rating: 4.7, reviews: 19, price: "$35", avatar: "OS" },
];

const categoryColors: Record<string, string> = {
  Beauty: "bg-pink-100 text-pink-700",
  Tech: "bg-blue-100 text-blue-700",
  Fashion: "bg-purple-100 text-purple-700",
  Food: "bg-orange-100 text-orange-700",
};

const FeaturedCreators = () => {
  const { t } = useI18n();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            {t("featured.title")}
          </motion.h2>
          <p className="text-muted-foreground text-lg">{t("featured.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {mockCreators.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-surface border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary font-display font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {creator.avatar}
              </div>
              <h3 className="font-display font-semibold text-center mb-1">{creator.name}</h3>
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-3">
                <MapPin className="w-3 h-3" /> {creator.city}
              </div>
              <div className="flex justify-center mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[creator.category] || "bg-muted text-muted-foreground"}`}>
                  {creator.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{creator.rating}</span>
                  <span className="text-muted-foreground">({creator.reviews})</span>
                </div>
                <span className="font-display font-semibold text-primary">{creator.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/creators">
            <Button variant="outline" size="lg">{t("featured.viewall")}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreators;
