"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useLogin } from "../hooks";
import { loginSchema, type LoginSchema } from "../schemas";
import { PasswordField } from "./PasswordField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

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
        <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200" htmlFor="email">
          البريد الإلكتروني
        </Label>

        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="example@email.com"
          aria-invalid={!!errors.email}
        />

        {errors.email && (
          <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
        )}
      </div>

      <PasswordField
        label="كلمة المرور"
        placeholder="********"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full mt-4"
      >
        {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>
    </form>
  );
}