"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("Contact");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-3"
    >
      <form className="rounded-3xl border border-slate-200 bg-card p-8 shadow-xl shadow-primary/5 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-950/30 md:p-10">
        <div className="mb-8 flex items-center gap-3">
          <MessageCircle className="size-6 text-primary" />
          <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Send a Message</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="mb-2 block text-sm font-medium text-foreground dark:text-slate-200">Name</label>
            <input className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500" placeholder={t("form.name")} />
          </div>
          <div className="md:col-span-1">
            <label className="mb-2 block text-sm font-medium text-foreground dark:text-slate-200">Email</label>
            <input className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500" placeholder={t("form.email")} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-foreground dark:text-slate-200">Message</label>
            <textarea className="min-h-40 w-full rounded-xl border border-slate-200 bg-background px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500" placeholder={t("form.message")} />
          </div>
          <div className="mt-2 md:col-span-2">
            <button type="button" className="w-full rounded-xl bg-primary px-4 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90">
              {t("form.submit")}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
