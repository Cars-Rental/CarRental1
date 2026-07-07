import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Compass, Home, Search } from "lucide-react";

export default async function NotFoundPage() {
  const locale = await getLocale();
  const t = await getTranslations("NotFound");
  const isRTL = locale === "ar";

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-10 flex items-center justify-center"
    >
      <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-2xl shadow-slate-950/10 dark:shadow-slate-950/50 sm:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#005C55]" />
        <div className="absolute -top-24 -end-24 size-48 rounded-full border border-[#005C55]/10 dark:border-[#005C55]/20" />
        <div className="absolute -bottom-28 -start-28 size-56 rounded-full border border-slate-200 dark:border-slate-800" />

        <div className="relative mx-auto mb-7 flex size-24 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <span className="absolute inset-0 rounded-full bg-[#005C55]/10 animate-ping" />
          <Compass className="relative size-11 text-[#005C55]" />
        </div>

        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#005C55]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          {t("description")}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#005C55] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#005C55]/20 transition-all duration-200 hover:bg-[#004a45] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="size-4" />
            <span>{t("home")}</span>
          </Link>
          <Link
            href={`/${locale}/cars/carRent`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#005C55] dark:hover:text-white"
          >
            <Search className="size-4" />
            <span>{t("browseCars")}</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
