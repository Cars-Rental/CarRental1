"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { NAV_LINKS } from "@/features/landing/constants/landing.constants";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  if (!isOpen) return null;

const isActive = (href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);;

  return (
    <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 px-4 py-6 space-y-3 shadow-inner">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              active
                ? "text-primary bg-emerald-50/50 dark:bg-slate-800/50"
                : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {t(link.key)}
          </Link>
        );
      })}

      <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
        <Link
          href={ROUTES.AUTH.LOGIN}
          onClick={onClose}
          className="w-full text-center py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
        >
          {t("login")}
        </Link>

        <Link
          href={ROUTES.AUTH.REGISTER}
          onClick={onClose}
          className="w-full text-center bg-[#005c55] hover:bg-[#004741] text-white text-sm font-bold py-3 rounded-xl shadow-md transition-all duration-150"
        >
          {t("signUp")}
        </Link>
      </div>
    </div>
  );
}