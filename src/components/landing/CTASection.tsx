import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const CTASection = () => {
  const { t } = useI18n();

  return (
    <section className="relative py-24 overflow-hidden bg-[#0b0c1a]">

      {/* ================= GRADIENT WAVE ================= */}

      <div className="absolute inset-0 z-0 overflow-hidden">

        {/* base gradient layer */}
        <div className="
          absolute inset-0
          bg-[radial-gradient(circle_at_30%_40%,rgba(255,90,95,0.25),transparent_50%),
               radial-gradient(circle_at_70%_60%,rgba(122,92,255,0.25),transparent_50%)]
        " />

        {/* animated wave layer */}
        <motion.div
          animate={{
            backgroundPosition: [
              "0% 50%",
              "100% 50%",
              "0% 50%",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            absolute inset-0
            bg-[linear-gradient(120deg,#ff5a5f,#ff7a7f,#7a5cff,#5c7cff)]
            opacity-[0.15]
            blur-[80px]
            bg-[length:200%_200%]
          "
        />

        {/* secondary wave (parallax feel) */}
        <motion.div
          animate={{
            backgroundPosition: [
              "100% 50%",
              "0% 50%",
              "100% 50%",
            ],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            absolute inset-0
            bg-[linear-gradient(240deg,#7a5cff,#ff5a5f,#ff7a7f)]
            opacity-[0.1]
            blur-[120px]
            bg-[length:200%_200%]
          "
        />

        {/* noise layer (premium touch) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      </div>

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 container mx-auto px-4 text-center">

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(32px,5vw,56px)] font-bold mb-6 text-white tracking-[-0.02em]"
        >
          {t("cta.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-lg mb-10 max-w-xl mx-auto"
        >
          {t("cta.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/signup">
            <Button
              size="lg"
              className="
                relative overflow-hidden px-8 py-6 text-base gap-2
                bg-gradient-to-r from-[#ff5a5f] to-[#ff7a7f]
                shadow-[0_10px_40px_rgba(255,90,95,0.35)]
                hover:shadow-[0_20px_60px_rgba(255,90,95,0.5)]
                transition-all
              "
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("cta.button")}
                <ArrowRight className="w-4 h-4" />
              </span>

              {/* shine */}
              <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default CTASection;