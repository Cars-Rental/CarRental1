"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface FAQItem {
  q: string;
  a: string;
}

export interface SharedFAQSectionProps {
  title: string;
  subtitle?: string;
  faqs: FAQItem[];
  className?: string;
}

export function SharedFAQSection({
  title,
  subtitle,
  faqs,
  className = "bg-muted/30 px-6 py-24",
}: SharedFAQSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className={className}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-700/70">
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left font-semibold text-slate-900 transition-colors hover:bg-slate-50 focus:outline-none dark:text-slate-100 dark:hover:bg-slate-800/60"
              >
                <span className="text-lg">{faq.q}</span>
                <ChevronDown
                  className={`size-5 text-slate-400 transition-transform dark:text-slate-500 ${openFaq === index ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-6 pb-5 text-slate-500 dark:text-slate-400"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
