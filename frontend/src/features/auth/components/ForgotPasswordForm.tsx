"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "" },
  });

  function onSubmit(data: any) {
    console.log("Forgot Password Data:", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200" htmlFor="email">
          البريد الإلكتروني
        </Label>
        <Input
          {...register("email", { required: "البريد الإلكتروني مطلوب" })}
          id="email"
          type="email"
          placeholder="example@email.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs font-medium text-destructive">{errors.email?.message as string}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2"
      >
        إرسال رابط استعادة كلمة المرور
      </Button>
      
      <div className="text-center mt-4 text-sm text-zinc-500">
        تذكرت كلمة المرور؟{" "}
        <a href="/login" className="text-primary hover:underline font-semibold">
          تسجيل الدخول
        </a>
      </div>
    </form>
  );
}
