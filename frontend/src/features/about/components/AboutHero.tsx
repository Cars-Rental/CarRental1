"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function AboutHero() {
  const t = useTranslations("About");

  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-24 text-center lg:pt-40 lg:pb-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl"
      >
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t("description")}
        </p>
      </motion.div>
    </section>
  );
}
