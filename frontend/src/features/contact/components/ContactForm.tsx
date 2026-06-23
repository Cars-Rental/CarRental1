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
      <form className="rounded-3xl border bg-card p-8 shadow-xl shadow-primary/5 md:p-10">
        <div className="mb-8 flex items-center gap-3">
          <MessageCircle className="size-6 text-primary" />
          <h2 className="text-2xl font-bold">Send a Message</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="mb-2 block text-sm font-medium text-foreground">Name</label>
            <input className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder={t("form.name")} />
          </div>
          <div className="md:col-span-1">
            <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
            <input className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder={t("form.email")} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-foreground">Message</label>
            <textarea className="min-h-40 w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder={t("form.message")} />
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
