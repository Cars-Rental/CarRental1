"use client";

import { useTranslations } from "next-intl";

import { ROUTES } from "@/config/routes";
import { Link } from "@/i18n/navigation";


export function AuthButtons() {
  const t = useTranslations("Navigation");

  return (
    <div className="hidden md:flex items-center gap-2.5 ms-1">
      <Link
        href={ROUTES.AUTH.LOGIN}
        className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
      >
        {t("login")}
      </Link>
      <Link
        href={ROUTES.AUTH.REGISTER}
        className="bg-[#005c55] hover:bg-[#004741] text-white text-xs font-bold py-2.5 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
      >
        {t("signUp")}
      </Link>
    </div>
  );
}
