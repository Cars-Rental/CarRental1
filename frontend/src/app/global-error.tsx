"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import "./globals.css";

const copy = {
  en: {
    title: "Something went wrong",
    description:
      "Rento could not load this page. Please try again, or return to the home page.",
    retry: "Try Again",
    home: "Go Home",
    digest: "Error reference",
  },
  ar: {
    title: "حدث خطأ غير متوقع",
    description:
      "تعذر على Rento تحميل هذه الصفحة. حاول مرة أخرى أو ارجع للصفحة الرئيسية.",
    retry: "حاول مرة أخرى",
    home: "الصفحة الرئيسية",
    digest: "مرجع الخطأ",
  },
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const locale =
    typeof window !== "undefined" &&
    window.location.pathname.split("/").filter(Boolean)[0] === "ar"
      ? "ar"
      : "en";
  const t = copy[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  const handleHome = () => {
    window.location.href = `/${locale}`;
  };

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <main className="min-h-screen px-6 py-10 flex items-center justify-center">
          <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50 sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#005C55]" />
            <div className="mx-auto mb-6 relative size-20">
              <span className="absolute inset-0 rounded-full bg-rose-400/20 animate-ping" />
              <div className="relative size-20 rounded-full border border-rose-100 bg-rose-50 text-rose-600 flex items-center justify-center dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                <AlertTriangle className="size-9" />
              </div>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {t.title}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t.description}
            </p>

            {error.digest && (
              <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                {t.digest}: {error.digest}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#005C55] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#005C55]/20 transition-all duration-200 hover:bg-[#004a45] hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCw className="size-4" />
                <span>{t.retry}</span>
              </button>
              <button
                type="button"
                onClick={handleHome}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-[#005C55] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Home className="size-4" />
                <span>{t.home}</span>
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
