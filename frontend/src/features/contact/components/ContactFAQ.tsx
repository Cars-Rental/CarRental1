"use client";

import { useTranslations } from "next-intl";
import { SharedFAQSection } from "@/components/shared/SharedFAQSection";

export function ContactFAQ() {
  const t = useTranslations("Contact");

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
  ];

  return (
    <SharedFAQSection
      title={t("faq.title")}
      faqs={faqs}
      className="bg-muted/30 px-6 py-24"
    />
  );
}
