"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function VerifyEmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { code: "" },
  });

  function onSubmit(data: any) {
    console.log("Verify Email Data:", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200" htmlFor="code">
          رمز التأكيد
        </Label>
        <Input
          {...register("code", { required: "رمز التأكيد مطلوب" })}
          id="code"
          type="text"
          placeholder="أدخل الرمز المكون من 6 أرقام"
          aria-invalid={!!errors.code}
          className="text-center tracking-widest text-lg"
        />
        {errors.code && (
          <p className="text-xs font-medium text-destructive">{errors.code?.message as string}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2"
      >
        تأكيد
      </Button>

      <div className="text-center mt-4 text-sm text-zinc-500">
        لم يصلك الرمز؟{" "}
        <button type="button" className="text-primary hover:underline font-semibold">
          إعادة الإرسال
        </button>
      </div>
    </form>
  );
}
