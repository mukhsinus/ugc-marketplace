import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, Building2, Camera } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const BenefitsSection = () => {
  const { t } = useI18n();
  const [mode, setMode] = useState<"brand" | "creator">("brand");

  const data = {
    brand: {
      icon: Building2,
      title: t("benefits.brands.title"),
      color: "primary",
      items: [
        t("benefits.brands.1"),
        t("benefits.brands.2"),
        t("benefits.brands.3"),
        t("benefits.brands.4"),
      ],
    },
    creator: {
      icon: Camera,
      title: t("benefits.creators.title"),
      color: "accent",
      items: [
        t("benefits.creators.1"),
        t("benefits.creators.2"),
        t("benefits.creators.3"),
        t("benefits.creators.4"),
      ],
    },
  };

  const current = data[mode];
  const Icon = current.icon;

  return (
    <section className="relative py-24 bg-[#0b0c1a] overflow-hidden">

      {/* ================= BACKGROUND SHIFT ================= */}
      <motion.div
        animate={{
          opacity: mode === "brand" ? 1 : 0,
        }}
        className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full"
      />

      <motion.div
        animate={{
          opacity: mode === "creator" ? 1 : 0,
        }}
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-accent/20 blur-[120px] rounded-full"
      />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 container mx-auto px-4 max-w-3xl text-center">

        {/* ===== TOGGLE ===== */}
        <div className="inline-flex p-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-12">

          {["brand", "creator"].map((type) => (
            <button
              key={type}
              onClick={() => setMode(type as "brand" | "creator")}
              className="relative px-6 py-2 text-sm font-medium text-white/70"
            >
              {mode === type && (
                <motion.div
                  layoutId="toggle-pill"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <span className="relative z-10">
                {type === "brand"
                  ? t("benefits.brands.title")
                  : t("benefits.creators.title")}
              </span>
            </button>
          ))}
        </div>

        {/* ===== CARD ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="
              p-10 rounded-2xl
              bg-white/5 backdrop-blur-xl
              border border-white/10
              shadow-[0_20px_60px_rgba(0,0,0,0.4)]
              text-left
            "
          >
            {/* icon */}
            <div
              className={`
                w-14 h-14 rounded-xl mb-6 flex items-center justify-center
                ${mode === "brand" ? "bg-primary/20" : "bg-accent/20"}
              `}
            >
              <Icon
                className={`w-7 h-7 ${
                  mode === "brand" ? "text-primary" : "text-accent"
                }`}
              />
            </div>

            {/* title */}
            <h3 className="text-2xl font-bold mb-6 text-white">
              {current.title}
            </h3>

            {/* list */}
            <ul className="space-y-5">
              {current.items.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 group"
                >
                  <div
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                      ${mode === "brand" ? "bg-primary/20" : "bg-accent/20"}
                    `}
                  >
                    <Check
                      className={`w-3 h-3 ${
                        mode === "brand" ? "text-primary" : "text-accent"
                      }`}
                    />
                  </div>

                  <span className="text-sm text-white/70 group-hover:text-white transition">
                    {b}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BenefitsSection;