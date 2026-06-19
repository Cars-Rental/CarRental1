"use client";

import { useForm } from "react-hook-form";
import { PasswordField } from "./PasswordField";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(data: any) {
    console.log("Reset Password Data:", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PasswordField
        label="كلمة المرور الجديدة"
        placeholder="********"
        error={errors.password?.message as string}
        {...register("password", { required: "كلمة المرور مطلوبة" })}
      />

      <PasswordField
        label="تأكيد كلمة المرور الجديدة"
        placeholder="********"
        error={errors.confirmPassword?.message as string}
        {...register("confirmPassword", { required: "تأكيد كلمة المرور مطلوب" })}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2"
      >
        إعادة تعيين كلمة المرور
      </Button>
    </form>
  );
}
