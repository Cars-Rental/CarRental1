"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail, SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { useDirection } from "@/lib";

import { useForgotPassword } from "../hooks";
import {
  createForgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../schemas";

export function ForgotPasswordForm() {
  const t = useTranslations("Auth.forgotPassword");
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const { isRTL } = useDirection();

  const forgotPasswordSchema = createForgotPasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: ForgotPasswordSchema) {
    forgotPassword(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-zinc-700 dark:text-slate-200">{t("email")}</Label>

        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          aria-invalid={!!errors.email}
          startIcon={<Mail className="size-5" />}
          className="dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        {errors.email && (
          <p className="text-xs font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="mt-2 w-full gap-2">
        {isPending && <LoaderCircle className="size-4 animate-spin" />}
        <span>{isPending ? t("submitting") : t("submit")}</span>
        {!isPending &&
          (isRTL ? (
            <SendHorizontal className="size-4 rotate-180" />
          ) : (
            <SendHorizontal className="size-4" />
          ))}
      </Button>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-zinc-600 dark:text-slate-400">
          {t("rememberPassword")}
        </span>

        <Link
          href="/login"
          className="text-sm font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline"
        >
          {t("login")}
        </Link>
      </div>
    </form>
  );
}
