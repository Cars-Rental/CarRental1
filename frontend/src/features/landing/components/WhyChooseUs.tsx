"use client";

import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Shield,
  Gauge,
  Banknote,
  Headphones,
} from "lucide-react";
import { useDirection } from "@/lib";

export function WhyChooseUs() {
  const t = useTranslations("Landing.whyUs");
  const { isRTL } = useDirection();

  const checklist = [t("check1"), t("check2"), t("check3")];

  const features = [
    {
      title: t("safeTitle"),
      desc: t("safeDesc"),
      icon: Shield,
      isSpecial: false,
    },
    {
      title: t("easyTitle"),
      desc: t("easyDesc"),
      icon: Gauge,
      isSpecial: true,
    },
    {
      title: t("priceTitle"),
      desc: t("priceDesc"),
      icon: Banknote,
      isSpecial: false,
    },
    {
      title: t("supportTitle"),
      desc: t("supportDesc"),
      icon: Headphones,
      isSpecial: false,
    },
  ];

  return (
    <section
      className="py-20 bg-slate-50 dark:bg-slate-950"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left Column: Text & Checklist */}
          <div className="space-y-6 text-start">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {t("title")}
            </h2>
            <div className="divider" />
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t("subtitle")}
            </p>

            {/* Checklist */}
            <ul className="space-y-3.5 pt-4">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-[var(--primary)] shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: 2x2 Grid of Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border flex flex-col justify-between h-40 transition-all duration-300 ${
                    feat.isSpecial
                      ? "bg-cyan-50 dark:bg-slate-900 border-cyan-100 dark:border-emerald-900/40 text-slate-800 dark:text-slate-100"
                      : "bg-[#e2e8f0]/40 dark:bg-slate-900/80 border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {feat.title}
                    </h3>
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        feat.isSpecial
                          ? "bg-[#0d9e8f] text-white"
                          : "bg-slate-200/60 dark:bg-slate-800 text-[var(--primary)] dark:text-emerald-400"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
