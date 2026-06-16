"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("HomePage");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p>{t("description")}</p>

      <button
        className="rounded-md border px-4 py-2"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Toggle Theme
      </button>
    </main>
  );
}