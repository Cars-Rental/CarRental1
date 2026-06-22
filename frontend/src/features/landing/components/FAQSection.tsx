"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useDirection } from "@/lib";

export function FAQSection() {
  const t = useTranslations("Landing.faq");
  const { isRTL } = useDirection();

  const faqs = [
    {
      id: "q1",
      question: t("q1"),
      answer: t("a1"),
    },
    {
      id: "q2",
      question: t("q2"),
      answer: t("a2"),
    },
    {
      id: "q3",
      question: t("q3"),
      answer: t("a3"),
    },
  ];

  return (
    <section
      className="py-20 bg-white dark:bg-slate-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container-main">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {t("title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium">
            {t("subtitle")}
          </p>
          <div className="divider mx-auto" />
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto">
          <Accordion className="w-full">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl mb-4 px-6 py-2 shadow-sm transition-all duration-200 hover:border-[var(--primary)]/40 hover:shadow-md"
              >
                <AccordionTrigger className="text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base border-none hover:no-underline py-4 flex justify-between items-center w-full focus:outline-none">
                  <span className="text-start">{faq.question}</span>
                </AccordionTrigger>

                <AccordionContent className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-2 pb-4 border-t border-slate-100 dark:border-slate-800/40">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
