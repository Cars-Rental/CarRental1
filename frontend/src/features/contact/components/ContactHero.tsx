"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function ContactHero() {
  const t = useTranslations("Contact");

  return (
    <section className="bg-muted/30 pb-16 pt-32 text-center lg:pb-24 lg:pt-40">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 text-lg text-muted-foreground">
          {t("description")}
        </p>
      </motion.div>
    </section>
  );
}
