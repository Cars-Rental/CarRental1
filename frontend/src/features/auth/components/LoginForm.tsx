"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDirection } from "@/lib";

import { useLogin } from "../hooks";
import { createLoginSchema, type LoginSchema } from "../schemas";
import { PasswordField } from "./PasswordField";

export function LoginForm() {
  const t = useTranslations("Auth.login");
  const loginSchema = createLoginSchema(t);
  const { mutate: login, isPending } = useLogin();
  const { isRTL } = useDirection();

  const socialProviders = [
    {
      key: "facebook",
      label: t("loginWithFacebook"),
      icon: FaFacebookF,
      // iconColor: "text-[#1877F2]",
    },
    {
      key: "google",
      label: t("loginWithGoogle"),
      icon: FaGoogle,
      // iconColor: "text-[#DB4437]",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginSchema) {
    login(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label
          className="text-sm font-semibold text-zinc-700 dark:text-zinc-200"
          htmlFor="email"
        >
          {t("email")}
        </Label>

        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          aria-invalid={!!errors.email}
          startIcon={<Mail className="size-5" />}
        />

        {errors.email && (
          <p className="text-xs font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-200"
            htmlFor="password"
          >
            {t("password")}
          </Label>

          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        <PasswordField
          id="password"
          label=""
          placeholder={t("passwordPlaceholder")}
          error={errors.password?.message}
          {...register("password")}
          startIcon={<LockKeyhole className="size-5" />}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label
          htmlFor="remember"
          className="text-sm font-semibold text-zinc-700 dark:text-zinc-200"
        >
          {t("rememberMe")}
        </Label>
      </div>

      <Button type="submit" disabled={isPending} className="mt-2 w-full gap-2">
        {isPending && <LoaderCircle className="size-4 animate-spin" />}
        <span>{isPending ? t("submitting") : t("submit")}</span>
        {!isPending &&
          (isRTL ? (
            <ArrowLeft className="size-4" />
          ) : (
            <ArrowRight className="size-4" />
          ))}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("or")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {socialProviders.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant="outline"
            type="button"
            className="group h-12 flex-row-reverse justify-center gap-3 border-zinc-200 bg-white text-zinc-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
          >
            <Icon
              className={`size-5 transition-transform duration-300 group-hover:scale-110`}
            />
            <span className="font-medium">{label}</span>
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("dontHaveAccount")}
        </span>

        <Link
          href="/register"
          className="text-sm font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline"
        >
          {t("createAccount")}
        </Link>
      </div>
    </form>
  );
}
