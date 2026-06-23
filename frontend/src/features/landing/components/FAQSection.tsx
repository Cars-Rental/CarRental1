"use client";

import { useTranslations } from "next-intl";
import { useDirection } from "@/lib";
import { SharedFAQSection } from "@/components/shared/SharedFAQSection";

export function FAQSection() {
  const t = useTranslations("Landing.faq");
  const { isRTL } = useDirection();

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <SharedFAQSection
        title={t("title")}
        subtitle={t("subtitle")}
        faqs={faqs}
        className="py-20 bg-white dark:bg-slate-900 px-6"
      />
    </div>
  );
}
