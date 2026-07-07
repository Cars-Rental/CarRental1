"use client";

import { useTranslations } from "next-intl";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { GENDERS } from "@/constants";

import type { Gender } from "../types";

interface GenderSelectorProps {
  value: Gender;
  onChange: (gender: Gender) => void;
  error?: string;
}

export function GenderSelector({ value, onChange, error }: GenderSelectorProps) {
  const t = useTranslations("Auth.register");

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-zinc-700 dark:text-slate-200">
        {t("gender")}
      </legend>

      <RadioGroup
        value={value}
        onValueChange={(value) => onChange(value as Gender)}
        className="grid grid-cols-2 gap-3"
      >
        <label
          htmlFor="male"
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white/70 p-3 text-slate-700 transition-all hover:border-primary dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-emerald-500",
            value === GENDERS.MALE &&
              "border-primary bg-primary/5 ring-1 ring-primary dark:bg-emerald-950/30"
          )}
        >
          <span>{t("genderOptions.male")}</span>
          <RadioGroupItem value={GENDERS.MALE} id="male" />
        </label>

        <label
          htmlFor="female"
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white/70 p-3 text-slate-700 transition-all hover:border-primary dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-emerald-500",
            value === GENDERS.FEMALE &&
              "border-primary bg-primary/5 ring-1 ring-primary dark:bg-emerald-950/30"
          )}
        >
          <span>{t("genderOptions.female")}</span>
          <RadioGroupItem value={GENDERS.FEMALE} id="female" />
        </label>
      </RadioGroup>

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </fieldset>
  );
}
