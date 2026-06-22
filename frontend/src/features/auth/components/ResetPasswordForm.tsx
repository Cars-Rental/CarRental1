"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import { useResetPassword } from "../hooks";
import {
  createResetPasswordSchema,
  type ResetPasswordSchema,
} from "../schemas";
import { PasswordField } from "./PasswordField";

export function ResetPasswordForm() {
  const t = useTranslations("Auth.resetPassword");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const resetPasswordSchema = createResetPasswordSchema(t);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: ResetPasswordSchema) {
    resetPassword({ email, ...data });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <PasswordField
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        error={errors.password?.message}
        {...register("password")}
        startIcon={<LockKeyhole className="size-5" />}
      />

      <PasswordField
        label={t("confirmPassword")}
        placeholder={t("passwordPlaceholder")}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
        startIcon={<LockKeyhole className="size-5" />}
      />

      <div className="rounded-xl bg-[#F1F4F3] p-4 text-sm text-muted-foreground">
        <p className="mb-3 font-medium text-foreground">
          {t("requirementsTitle")}
        </p>

        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            <span>{t("requirementMin")}</span>
          </li>

          <li className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            <span>{t("requirementUpperLower")}</span>
          </li>
        </ul>
      </div>

      <Button
        type="submit"
        disabled={isPending || !email}
        className="mt-2 w-full gap-2"
      >
        {isPending && <LoaderCircle className="size-4 animate-spin" />}
        <span>{isPending ? t("submitting") : t("submit")}</span>
        {!isPending && <RotateCcw className="size-4" />}
      </Button>

      <div className="flex items-center justify-center gap-2">
        <Link
          href="/login"
          className="text-sm font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline"
        >
          {t("backToLogin")}
        </Link>
      </div>
    </form>
  );
}