"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { useTranslations } from "next-intl";

export function AboutMission() {
  const t = useTranslations("About");

  const stats = [
    { value: t("stats.users"), label: t("stats.usersLabel") },
    { value: t("stats.cars"), label: t("stats.carsLabel") },
    { value: t("stats.cities"), label: t("stats.citiesLabel") },
  ];

  return (
    <section className="bg-muted/30 px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target className="size-6" />
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              {t("mission.title")}
            </h2>
            <p className="mt-4 text-xl font-medium text-foreground">
              {t("mission.subtitle")}
            </p>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>{t("mission.desc1")}</p>
              <p>{t("mission.desc2")}</p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-3xl border bg-card p-8 text-center shadow-sm"
              >
                <div className="mb-2 text-4xl font-extrabold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
