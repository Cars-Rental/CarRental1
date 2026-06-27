"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function changeLanguage() {
    const nextLocale = locale === "ar" ? "en" : "ar";

    const segments = pathname.split("/");
    segments[1] = nextLocale;

    router.push(segments.join("/"));
  }

  return (
    <button
      onClick={changeLanguage}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold"
    >
      <Globe size={16} />

      {locale === "ar" ? "English" : "العربية"}
    </button>
  );
}
