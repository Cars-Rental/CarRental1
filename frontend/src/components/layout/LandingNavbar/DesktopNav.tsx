"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/features/landing/constants/landing.constants";

export function DesktopNav() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  return (
    <ul className="hidden md:flex items-center gap-1.5">
      {NAV_LINKS.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/" || pathname === "/ar" || pathname === "/en"
            : pathname.startsWith(link.href);

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                  ? "text-primary bg-emerald-50/60 dark:bg-slate-800/60"
                  : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              {t(link.key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
