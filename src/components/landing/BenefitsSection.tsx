import { motion } from "framer-motion";
import { Check, Building2, Camera } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const BenefitsSection = () => {
  const { t } = useI18n();

  const brandBenefits = [t("benefits.brands.1"), t("benefits.brands.2"), t("benefits.brands.3"), t("benefits.brands.4")];
  const creatorBenefits = [t("benefits.creators.1"), t("benefits.creators.2"), t("benefits.creators.3"), t("benefits.creators.4")];

  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Brands */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-background border border-border"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-6">{t("benefits.brands.title")}</h3>
            <ul className="space-y-4">
              {brandBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Creators */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-background border border-border"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
              <Camera className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-6">{t("benefits.creators.title")}</h3>
            <ul className="space-y-4">
              {creatorBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
