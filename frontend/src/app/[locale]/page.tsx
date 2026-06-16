import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-lg text-zinc-600">{t("description")}</p>
    </main>
  );
}