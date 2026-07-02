"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
}

export function PasswordField({
  label = "Password",
  error,
  startIcon,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-zinc-700 dark:text-slate-200">
        {label}
      </Label>

      <div className="relative">
         {startIcon && (
        <div className="pointer-events-none absolute inset-s-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-500">
          {startIcon}
        </div>
      )}

        <Input
          {...props}
          type={showPassword ? "text" : "password"}
          aria-invalid={!!error}
className={cn(
      startIcon && "ps-11",
      "pe-11 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500",
      props.className
    )}        />

        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 dark:text-slate-500 dark:hover:text-slate-200"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
