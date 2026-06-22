"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FOOTER_SECTIONS } from "@/features/landing/constants/landing.constants";
import { useLocale, useTranslations } from "next-intl";
import { useDirection } from "@/lib";

export function Footer() {
  const t = useTranslations("Landing.footer");
  const { isRTL } = useDirection();
  const locale = useLocale();
  return (
    <footer
      className="bg-slate-900 text-slate-300 border-t border-slate-800"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Footer */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href={`/${locale}`}>
              <Image
                src="/assets/images/logos/logo.png"
                alt="DriveEase"
                width={130}
                height={40}
                className="h-9 w-auto object-contain dark:brightness-110"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {t("desc")}
            </p>

            {/* Contact Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-400">
                <Phone size={16} className="text-[var(--primary)] shrink-0" />
                <span dir="ltr">+20 100 000 0000</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail size={16} className="text-[var(--primary)] shrink-0" />
                <span>info@drivease.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={16} className="text-[var(--primary)] shrink-0" />
                <span>{locale === "ar" ? "القاهرة، مصر" : "Cairo, Egypt"}</span>
              </div>
            </div>
          </div>

          {/* Link Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-white font-bold text-sm tracking-wide">
                {locale === "ar" ? section.titleAr : section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-sm text-slate-400 hover:text-[var(--primary)] transition-colors duration-150 font-medium"
                    >
                      {locale === "ar" ? link.labelAr : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Applications Download Column */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wide">
              {locale === "ar" ? "تطبيقاتنا" : "Applications"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {t("downloadText")}
            </p>

            {/* Download Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* App Store */}
              <a
                href="#"
                className="flex items-center gap-3 bg-black border border-slate-700/80 rounded-xl py-2 px-4 hover:bg-slate-950 hover:border-slate-600 transition-all duration-200 w-fit select-none"
              >
                {/* Apple Icon */}
                <svg
                  className="w-5 h-5 text-white shrink-0 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08 2.15-.52 2.81-1.33z" />
                </svg>
                <div className="text-start">
                  <p className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                    Download on the
                  </p>
                  <p className="text-xs font-bold text-white leading-none">
                    App Store
                  </p>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="#"
                className="flex items-center gap-3 bg-black border border-slate-700/80 rounded-xl py-2 px-4 hover:bg-slate-950 hover:border-slate-600 transition-all duration-200 w-fit select-none"
              >
                {/* Play Store Icon */}
                <svg
                  className="w-5 h-5 text-white shrink-0 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 3.14a1.68 1.68 0 0 0-.44 1.17v15.38a1.68 1.68 0 0 0 .44 1.17l.07.07 8.84-8.84v-.16L5.07 3.07l-.07.07zM17.56 12.52l-3.25-3.25v6.5l3.25-3.25zM14.31 9.27L6.2 4.67a1.1 1.1 0 0 0-1.1 0l9.21 9.21 9.21-9.21a1.1 1.1 0 0 0-1.1 0l-8.11 4.6zM6.2 19.33l8.11-4.6 9.21 9.21a1.1 1.1 0 0 0 1.1 0l-9.21-9.21-9.21 9.21a1.1 1.1 0 0 0 1.1 0z" />
                </svg>
                <div className="text-start">
                  <p className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                    Get it on
                  </p>
                  <p className="text-xs font-bold text-white leading-none">
                    Google Play
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950/30">
        <div className="container mx-auto py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-medium">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>

          <div className="flex gap-4 items-center">
            {/* Social Links */}
            <div className="flex gap-3.5 me-4 border-r border-slate-800 pr-4 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-4">
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaXTwitter size={16} />
              </a>
            </div>

            <Link
              href={`/${locale}/privacy`}
              className="hover:text-slate-300 transition-colors font-medium"
            >
              {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="hover:text-slate-300 transition-colors font-medium"
            >
              {locale === "ar" ? "الشروط والأحكام" : "Terms of Service"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
