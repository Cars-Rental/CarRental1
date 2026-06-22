"use client";

// import { useRouter } from "next/navigation";
import { MapPin, Calendar, Car, Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/lib";
import { useRouter } from "@/i18n/navigation";

export function HeroSection() {
  const router = useRouter();
  const t = useTranslations("Landing.hero");
  const { isRTL } = useDirection();
  const [form, setForm] = useState({
    location: "Cairo",
    date: "",
    carType: "family",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (form.location) params.set("city", form.location);
    if (form.date) params.set("date", form.date);
    if (form.carType) params.set("type", form.carType);
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-32 overflow-hidden bg-slate-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('/assets/images/landing/heroSection-car.png')] bg-cover bg-center opacity-70 dark:opacity-50"
        aria-hidden="true"
      />
      {/* Soft gradient overlay for text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/40 to-slate-950/50"
        aria-hidden="true"
      />

      <div className="container-main relative z-20 w-full text-center">
        {/* Title */}
        <h1
          className="text-white font-extrabold leading-tight mb-6 drop-shadow-md text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-pre-line"
          style={{
            fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-sans)",
          }}
        >
          {t("title")}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-sm">
          {t("subtitle")}
        </p>

        {/* Floating Search Container */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 rounded-3xl p-4 shadow-2xl md:flex md:items-center md:gap-4 md:divide-x md:divide-slate-200/50 dark:md:divide-slate-800/50 md:rtl:divide-x-reverse">
            {/* City Field */}
            <div className="flex-1 flex items-center gap-3 p-3 text-start">
              <MapPin className="text-[var(--primary)] size-5 shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-0.5">
                  {t("cityLabel")}
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder={t("cityPlaceholder")}
                  className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 font-medium text-sm focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Date Field */}
            <div className="flex-1 flex items-center gap-3 p-3 text-start md:border-t-0 border-t border-slate-200/30 dark:border-slate-800/30">
              <Calendar className="text-[var(--primary)] size-5 shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-0.5">
                  {t("dateLabel")}
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 font-medium text-sm focus:outline-none placeholder:text-slate-400 [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Car Type Field */}
            <div className="flex-1 flex items-center gap-3 p-3 text-start md:border-t-0 border-t border-slate-200/30 dark:border-slate-800/30">
              <Car className="text-[var(--primary)] size-5 shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-0.5">
                  {t("typeLabel")}
                </label>
                <select
                  value={form.carType}
                  onChange={(e) =>
                    setForm({ ...form, carType: e.target.value })
                  }
                  className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 font-medium text-sm focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <option
                    value="family"
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    {isRTL ? "عائلية" : "Family"}
                  </option>
                  <option
                    value="economy"
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    {isRTL ? "اقتصادية" : "Economy"}
                  </option>
                  <option
                    value="luxury"
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    {isRTL ? "فاخرة" : "Luxury"}
                  </option>
                  <option
                    value="suv"
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    {isRTL ? "SUV" : "SUV"}
                  </option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="p-2 md:border-t-0 border-t border-slate-200/30 dark:border-slate-800/30 shrink-0">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 hover:scale-[1.02] transition-all duration-200"
              >
                <Search className="size-4" />
                <span>{t("searchBtn")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
