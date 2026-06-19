"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "use-intl";
import { useDirection } from "@/lib";

interface RoleSelectorProps {
  value: "user" | "trader";
  onChange: (role: "user" | "trader") => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const t = useTranslations("Auth.register.role");
  const { isRTL } = useDirection();
  return (
    <div className="relative grid h-12 grid-cols-2 rounded-lg bg-zinc-100 p-1">
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
            ? value === "trader"
              ? "left-1"
              : "right-1"
            : value === "trader"
              ? "right-1"
              : "left-1",
        )}
      />
      <button
        type="button"
        onClick={() => onChange("user")}
        className={cn(
          "relative z-10 rounded-md text-sm font-semibold transition-colors duration-300",
          value === "user" ? "text-white" : "text-zinc-600 hover:text-zinc-900",
        )}
      >
        {t("user")}
      </button>

      <button
        type="button"
        onClick={() => onChange("trader")}
        className={cn(
          "relative z-10 rounded-md text-sm font-semibold transition-colors duration-300",
          value === "trader"
            ? "text-white"
            : "text-zinc-600 hover:text-zinc-900",
        )}
      >
        {t("trader")}{" "}
      </button>
    </div>
  );
}
