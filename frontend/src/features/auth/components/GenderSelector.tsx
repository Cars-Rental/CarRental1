"use client";

import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GENDERS } from "@/constants";

import type { Gender } from "../types";



interface GenderSelectorProps {
  value: Gender;
  onChange: (gender: Gender) => void;
  error?: string;
}

export function GenderSelector({
  value,
  onChange,
  error,
}: GenderSelectorProps) {
  const t = useTranslations("Auth.register");

  return (
    <div className="space-y-3">
      <Label>{t("gender")}</Label>

      <RadioGroup
        value={value}
        onValueChange={(value) => onChange(value as "Male" | "Female")}
        className="grid grid-cols-2 gap-3"
      >
        <Label
          htmlFor="male"
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:border-primary",
            value === GENDERS.MALE &&
              "border-primary bg-primary/5 ring-1 ring-primary"
          )}
        >
          <div className="flex items-center gap-2">
            <span>{t("genderOptions.male")}</span>
          </div>

          <RadioGroupItem value={GENDERS.MALE} id="male" />
        </Label>

        <Label
          htmlFor="female"
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:border-primary",
            value === GENDERS.FEMALE &&
              "border-primary bg-primary/5 ring-1 ring-primary"
          )}
        >
          <div className="flex items-center gap-2">
            <span>{t("genderOptions.female")}</span>
          </div>

          <RadioGroupItem value={GENDERS.FEMALE} id="female" />
        </Label>
      </RadioGroup>

      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}