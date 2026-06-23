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
      <div className="rounded-3xl border bg-card p-8 shadow-sm">
        <h3 className="mb-8 text-xl font-bold">Contact Information</h3>
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
                <h4 className="font-semibold text-foreground">{title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Socials */}
        <div className="mt-10 border-t pt-8">
          <h4 className="mb-4 font-semibold text-foreground">{t("social.title")}</h4>
          <div className="flex gap-4 text-muted-foreground">
            <a href="#" className="flex size-10 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground"><FaFacebookF className="size-5" /></a>
            <a href="#" className="flex size-10 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground"><FaXTwitter className="size-5" /></a>
            <a href="#" className="flex size-10 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground"><FaInstagram className="size-5" /></a>
            <a href="#" className="flex size-10 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground"><FaLinkedinIn className="size-5" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
