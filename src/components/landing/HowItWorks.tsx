import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlus, Search, DollarSign } from "lucide-react";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";

const HowItWorks = () => {
  const { t } = useI18n();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 25%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);

  const steps = [
    {
      icon: UserPlus,
      title: t("how.step1.title"),
      desc: t("how.step1.desc"),
    },
    {
      icon: Search,
      title: t("how.step2.title"),
      desc: t("how.step2.desc"),
    },
    {
      icon: DollarSign,
      title: t("how.step3.title"),
      desc: t("how.step3.desc"),
    },
  ];

  return (
    <section className="relative py-20 md:py-24 bg-background overflow-hidden">

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 container mx-auto px-4">
        {/* header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("how.title")}
          </h2>
          <p className="text-muted-foreground text-lg">{t("how.subtitle")}</p>
        </div>

        {/* timeline */}
        <div ref={ref} className="relative max-w-4xl mx-auto">
          {/* base line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border/30" />

          {/* animated line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 md:left-1/2 top-0 w-px bg-gradient-to-b from-primary to-accent origin-top"
          />

          {/* steps */}
          <div className="flex flex-col gap-20">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className={`
                    relative flex flex-col md:flex-row items-start md:items-center
                    ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}
                  `}
                >
                  {/* content */}
                  <div className="w-full md:w-1/2 px-6 md:px-8">
                    <div
                      className="
                      p-6 rounded-2xl
                      bg-white/5 backdrop-blur-xl
                      border border-white/10
                      hover:border-primary/30
                      hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]
                      transition-all duration-300
                    "
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="
                        w-10 h-10 rounded-full
                        bg-gradient-to-br from-[#ff5a5f] to-[#7a5cff]
                        flex items-center justify-center
                        shadow-[0_0_25px_rgba(255,90,95,0.5)]
                      "
                    >
                      <step.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>

                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
