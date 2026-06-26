"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { LanguageToggle, Logo, ThemeToggle } from "@/components/shared";


export function AuthHeader() {
  const locale = useLocale();

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 py-3">
      <nav className="container mx-auto px-4 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />

          <Link
            href={`/${locale}`}
            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary"
          >
            {locale === "ar" ? "الرئيسية" : "Back Home"}
          </Link>
        </div>
      </nav>
    </header>
  );
}