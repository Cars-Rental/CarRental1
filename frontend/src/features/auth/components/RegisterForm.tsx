"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, LoaderCircle, Mail, UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRegister } from "../hooks";
import { createRegisterSchema, type RegisterSchema } from "../schemas";
import { RoleSelector } from "./RoleSelector";
import { PasswordField } from "./PasswordField";
import { useDirection } from "@/lib";

export function RegisterForm() {
  const t = useTranslations("Auth.register");
  const registerSchema= createRegisterSchema(t);
  const { mutate: registerUser, isPending } = useRegister();
  const {isRTL}= useDirection();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      email: "",
      phone: "",
      gender: "male",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });
  const selectedRole = useWatch({
    control,
    name: "role",
  });
  function onSubmit(data: RegisterSchema) {
    registerUser(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <RoleSelector
        value={selectedRole}
        onChange={(role) =>
          setValue("role", role, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <div className="space-y-2">
        <Label
          className="text-sm font-semibold text-zinc-700 dark:text-zinc-200"
          htmlFor="userName"
        >
          {t("fullName")}
        </Label>
        <Input
          {...register("userName")}
          id="userName"
          placeholder={t("fullNamePlaceholder")}
          aria-invalid={!!errors.userName}
          endIcon={<UserRound className="size-5" />}
        />
        {errors.userName && (
          <p className="text-xs font-medium text-destructive">
            {errors.userName.message}
          </p>
        )}
      </div>

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
          endIcon={<Mail className="size-5" />}
        />
        {errors.email && (
          <p className="text-xs font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          className="text-sm font-semibold text-zinc-700 dark:text-zinc-200"
          htmlFor="phone"
        >
          {t("phone")}
        </Label>
        <Input
          {...register("phone")}
          id="phone"
          placeholder={t("phonePlaceholder")}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-xs font-medium text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      <PasswordField
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        label={t("confirmPassword")}
        placeholder={t("passwordPlaceholder")}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label
          htmlFor="terms"
          className="text-sm font-semibold text-zinc-700 dark:text-zinc-200"
        >
          {t("terms")}
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

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-zinc-600">{t("alreadyHaveAccount")}</span>

        <Link
          href="/login"
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {t("login")}
        </Link>
      </div>
    </form>
  );
}
