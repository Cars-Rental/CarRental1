"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Car, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export function AboutValues() {
  const t = useTranslations("About");

  const cards = [
    {
      title: t("cards.trust.title"),
      desc: t("cards.trust.desc"),
      icon: ShieldCheck,
    },
    { title: t("cards.cars.title"), desc: t("cards.cars.desc"), icon: Car },
    { title: t("cards.users.title"), desc: t("cards.users.desc"), icon: Users },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold text-slate-950 dark:text-slate-100 md:text-4xl">{t("cards.title")}</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {cards.map(({ title, desc, icon: Icon }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="group rounded-3xl border border-primary/10 bg-card p-8 text-start shadow-sm transition-all hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-700/70"
          >
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-slate-100">{title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground dark:text-slate-400">
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
