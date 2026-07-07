"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { useTranslations } from "next-intl";

export function ContactInfo() {
  const t = useTranslations("Contact");

  const items = [
    { icon: Phone, title: t("info.phone.title"), value: t("info.phone.value") },
    { icon: Mail, title: t("info.email.title"), value: t("info.email.value") },
    { icon: MapPin, title: t("info.address.title"), value: t("info.address.value") },
  ];

  return (
    <div className="space-y-10 lg:col-span-2">
      <div className="rounded-3xl border border-slate-200 bg-card p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <h3 className="mb-8 text-xl font-bold text-slate-950 dark:text-slate-100">Contact Information</h3>
        <div className="space-y-6">
          {items.map(({ icon: Icon, title, value }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground dark:text-slate-100">{title}</h4>
                <p className="mt-1 text-sm text-muted-foreground dark:text-slate-400">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Socials */}
        <div className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h4 className="mb-4 font-semibold text-foreground dark:text-slate-100">{t("social.title")}</h4>
          <div className="flex gap-4 text-muted-foreground dark:text-slate-400">
            <a href="#" className="flex size-10 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground dark:bg-slate-800 dark:hover:bg-primary"><FaFacebookF className="size-5" /></a>
            <a href="#" className="flex size-10 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground dark:bg-slate-800 dark:hover:bg-primary"><FaXTwitter className="size-5" /></a>
            <a href="#" className="flex size-10 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground dark:bg-slate-800 dark:hover:bg-primary"><FaInstagram className="size-5" /></a>
            <a href="#" className="flex size-10 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground dark:bg-slate-800 dark:hover:bg-primary"><FaLinkedinIn className="size-5" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
