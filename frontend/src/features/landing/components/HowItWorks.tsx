"use client";

import { useTranslations } from "next-intl";
import { Search, Calendar, Key } from "lucide-react";
import { useDirection } from "@/lib";

interface HowItWorksProps {
  locale: string;
}

export function HowItWorks({ locale }: HowItWorksProps) {
  const t = useTranslations("Landing.howItWorks");
  const { isRTL } = useDirection();

  const steps = [
    {
      title: t("searchTitle"),
      desc: t("searchDesc"),
      icon: Search,
    },
    {
      title: t("bookTitle"),
      desc: t("bookDesc"),
      icon: Calendar,
    },
    {
      title: t("driveTitle"),
      desc: t("driveDesc"),
      icon: Key,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/40" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container-main text-center">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {t("title")}
        </h2>
        <div className="divider mx-auto mb-16" />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center px-4 group">
                {/* Circular Icon Container */}
                <div className="w-16 h-16 rounded-full bg-cyan-50 dark:bg-slate-800 border-2 border-cyan-100 dark:border-slate-700 flex items-center justify-center text-[var(--primary)] mb-6 shadow-sm group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:border-[var(--primary)] transition-all duration-300">
                  <Icon className="size-6 transition-colors duration-300" />
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
