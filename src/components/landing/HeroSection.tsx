import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountUp from "@/components/ui/countUp";
import { useI18n } from "@/lib/i18n";

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center bg-[#0b0c1a]">
      {/* ================= BACKGROUND SYSTEM ================= */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* base gradient */}
        <div
          className="absolute inset-0 
          bg-[radial-gradient(circle_at_30%_20%,rgba(255,90,95,0.12),transparent_40%),
               radial-gradient(circle_at_70%_60%,rgba(120,80,255,0.12),transparent_50%)]
        "
        />

        {/* animated glow */}
        <motion.div
          animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px]"
        />

        {/* noise */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-soft-light bg-[url('/noise.png')]" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-12 min-h-screen py-20 lg:py-0">
          {/* ================= LEFT SIDE ================= */}
          <div className="max-w-2xl text-center lg:text-left">
            {/* badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-gradient-to-r from-primary/20 to-accent/20
                border border-white/10 backdrop-blur-md
                shadow-[0_0_30px_rgba(255,90,95,0.2)]
                mb-8
              "
            >
              <span className="text-sm text-white/80">{t("hero.badge")}</span>
            </motion.div>

            {/* title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-[clamp(42px,6vw,72px)] leading-[1.05] tracking-[-0.02em] font-bold mb-6"
            >
              <span className="text-white">{t("hero.title1")} </span>

              <span className="bg-gradient-to-r from-[#ff5a5f] via-[#ff7a7f] to-[#7a5cff] bg-clip-text text-transparent font-extrabold">
                {t("hero.title2")}
              </span>

              {t("hero.title3") && (
                <span className="text-white"> {t("hero.title3")}</span>
              )}
            </motion.h1>

            {/* subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 max-w-xl mb-10"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/signup?role=brand">
                <Button
                  size="lg"
                  className="
                    relative overflow-hidden px-8 gap-2
                    bg-gradient-to-r from-[#ff5a5f] to-[#ff7a7f]
                    shadow-[0_10px_40px_rgba(255,90,95,0.35)]
                    hover:shadow-[0_20px_60px_rgba(255,90,95,0.5)]
                    transition-all
                  "
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("hero.cta.brand")} <ArrowRight className="w-4 h-4" />
                  </span>

                  {/* shine */}
                  <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                </Button>
              </Link>

              <Link to="/signup?role=creator">
                <Button
                  size="lg"
                  variant="outline"
                  className="
                    backdrop-blur-xl bg-white/5
                    border border-white/20 text-white
                    hover:border-white/40 hover:bg-white/10
                    transition-all px-8 gap-2
                  "
                >
                  <Play className="w-4 h-4" />
                  {t("hero.cta.creator")}
                </Button>
              </Link>
            </motion.div>

            {/* stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-md divide-x divide-white/10"
            >
              {[
                { value: 500, suffix: "+", label: t("hero.stats.creators") },
                { value: 120, suffix: "+", label: t("hero.stats.brands") },
                { value: 2000, suffix: "+", label: t("hero.stats.videos") },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="text-center px-4"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs md:text-sm text-white/50 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          {/* ================= RIGHT SIDE (UGC CARDS) ================= */}
          <div className="relative hidden lg:block w-[520px] h-[520px]">
            {[
              {
                top: "8%",
                left: "10%",
                name: "Madina R.",
                tag: "Fashion",
                price: "$60",
                rating: "5.0",
              },
              {
                top: "40%",
                left: "60%",
                name: "Jasur M.",
                tag: "Tech",
                price: "$40",
                rating: "4.8",
              },
              {
                top: "70%",
                left: "25%",
                name: "Nilufar K.",
                tag: "Beauty",
                price: "$50",
                rating: "4.9",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -25, 0],
                  rotate: [0, i % 2 === 0 ? 2 : -2, 0],
                }}
                transition={{
                  duration: 6 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
        absolute w-44 h-56 rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.4)]
        p-4 flex flex-col justify-between
      "
                style={card}
              >
                {/* avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff5a5f] to-[#7a5cff] flex items-center justify-center text-white font-bold">
                  {card.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* info */}
                <div>
                  <div className="text-white text-sm font-semibold">
                    {card.name}
                  </div>

                  <div className="text-white/50 text-xs">{card.tag}</div>
                </div>

                {/* bottom row */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-400">★ {card.rating}</span>
                  <span className="text-white font-semibold">{card.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
