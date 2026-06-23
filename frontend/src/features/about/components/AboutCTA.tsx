"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useDirection } from "@/lib";

export function AboutCTA() {
  const t = useTranslations("About");
  const { isRTL } = useDirection();

  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[3rem] bg-primary px-6 py-16 text-center shadow-2xl md:px-16 lg:py-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white opacity-10 via-transparent to-transparent"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-5xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
            {t("cta.desc")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/cars"
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-background px-8 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-muted sm:w-auto"
            >
              {t("cta.buttonRent")} {isRTL ? <ArrowLeft className="ms-2 size-4" /> : <ArrowRight className="ms-2 size-4" />}
            </Link>
            <Link
              href="/cars"
              className="inline-flex h-14 w-full items-center justify-center rounded-full border-2 border-primary-foreground/20 px-8 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-foreground/10 sm:w-auto"
            >
              {t("cta.buttonBuy")}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
