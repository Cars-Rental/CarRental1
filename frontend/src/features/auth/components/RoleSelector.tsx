"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { ROLES, type UserRole } from "@/constants";
import { useDirection } from "@/lib";
import { cn } from "@/lib/utils";

type SelectableRole = Exclude<UserRole, typeof ROLES.ADMIN>;

interface RoleSelectorProps {
  value: SelectableRole;
  onChange: (role: SelectableRole) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const t = useTranslations("Auth.register.role");
  const { isRTL } = useDirection();

  return (
    <div className="relative grid h-12 grid-cols-2 rounded-lg bg-zinc-100 p-1 dark:bg-slate-800/70 dark:ring-1 dark:ring-slate-700">
      <motion.div
        layoutId="active-role"
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 70,
        }}
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md bg-primary shadow-md",
          isRTL
            ? value === ROLES.TRADER
              ? "left-1"
              : "right-1"
            : value === ROLES.TRADER
              ? "right-1"
              : "left-1",
        )}
      />

      <button
        type="button"
        onClick={() => onChange(ROLES.USER)}
        className={cn(
          "relative z-10 rounded-md text-sm font-semibold transition-colors duration-300",
          value === ROLES.USER
            ? "text-white"
            : "text-zinc-600 hover:text-zinc-900 dark:text-slate-300 dark:hover:text-white",
        )}
      >
        {t("user")}
      </button>

      <button
        type="button"
        onClick={() => onChange(ROLES.TRADER)}
        className={cn(
          "relative z-10 rounded-md text-sm font-semibold transition-colors duration-300",
          value === ROLES.TRADER
            ? "text-white"
            : "text-zinc-600 hover:text-zinc-900 dark:text-slate-300 dark:hover:text-white",
        )}
      >
        {t("trader")}
      </button>
    </div>
  );
}
