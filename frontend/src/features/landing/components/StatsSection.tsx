"use client";

import { STATS } from "../constants/landing.constants";
import { useDirection } from "@/lib";

export function StatsSection() {
  const { isRTL } = useDirection();

  return (
    <div
      className="bg-[var(--primary)] text-white py-6 shadow-md relative z-30 -mt-10 max-w-4xl mx-auto rounded-2xl border border-white/10"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container-main">
        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-white/20 rtl:divide-x-reverse">
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold block mb-0.5 tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-slate-100 font-medium opacity-90">
                {isRTL ? stat.labelAr : stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
