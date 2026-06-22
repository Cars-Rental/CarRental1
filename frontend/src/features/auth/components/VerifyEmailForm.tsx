"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useResendCode, useVerifyEmail } from "../hooks";
import { createVerifyEmailSchema, type VerifyEmailSchema } from "../schemas";
import type { VerifyEmailType } from "../types";

const RESEND_SECONDS = 60;
const OTP_LENGTH = 6;

export function VerifyEmailForm() {
  const t = useTranslations("Auth.verifyEmail");
  const searchParams = useSearchParams();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const email = searchParams.get("email") ?? "";
  const typeParam = searchParams.get("type");
  const type: VerifyEmailType = typeParam === "reset" ? "reset" : "register";

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const verifyEmailSchema = createVerifyEmailSchema(t);

  const { mutate: verifyEmail, isPending } = useVerifyEmail();
  const { mutate: resendCode, isPending: isResending } = useResendCode();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  const canResend = secondsLeft === 0;

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const maskedEmail = useMemo(() => {
    if (!email.includes("@")) return email;

    const [name, domain] = email.split("@");

    return `${name.slice(0, 2)}***@${domain}`;
  }, [email]);

  function onSubmit(data: VerifyEmailSchema) {
    verifyEmail({
      email,
      type,
      otp: data.otp,
    });
  }

  function handleResend() {
    if (!canResend || !email) return;

    resendCode(
      { email, type },
      {
        onSuccess: () => {
          setSecondsLeft(RESEND_SECONDS);
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-xl border bg-muted/40 p-4 text-center">
        <p className="text-sm text-muted-foreground">{t("sentTo")}</p>
        <p className="mt-1 font-semibold text-foreground">{maskedEmail}</p>
      </div>

      <div className="space-y-2">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => {
            const value = field.value
              .padEnd(OTP_LENGTH, " ")
              .slice(0, OTP_LENGTH)
              .split("");

            function handleChange(index: number, digit: string) {
              const cleanDigit = digit.replace(/\D/g, "").slice(-1);
              const nextValue = field.value.split("");

              nextValue[index] = cleanDigit;

              const otp = nextValue.join("").slice(0, OTP_LENGTH);
              field.onChange(otp);

              if (cleanDigit && index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
              }
            }

            function handleKeyDown(
              index: number,
              event: React.KeyboardEvent<HTMLInputElement>,
            ) {
              if (
                event.key === "Backspace" &&
                !value[index].trim() &&
                index > 0
              ) {
                inputRefs.current[index - 1]?.focus();
              }
            }

            function handlePaste(
              event: React.ClipboardEvent<HTMLInputElement>,
            ) {
              event.preventDefault();

              const pasted = event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, OTP_LENGTH);

              field.onChange(pasted);

              const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
              inputRefs.current[nextIndex]?.focus();
            }

            return (
              <div className="flex justify-center gap-2" dir="ltr">
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <Input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    value={value[index].trim()}
                    onChange={(event) =>
                      handleChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    inputMode="numeric"
                    maxLength={1}
                    aria-invalid={!!errors.otp}
                    className="size-14 rounded-lg text-center text-lg font-bold"
                  />
                ))}
              </div>
            );
          }}
        />

        {errors.otp && (
          <p className="text-center text-xs font-medium text-destructive">
            {errors.otp.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending || !email}
        className="mt-2 w-full gap-2"
      >
        {isPending && <LoaderCircle className="size-4 animate-spin" />}
        <span>{isPending ? t("submitting") : t("submit")}</span>
        {!isPending && <ShieldCheck className="size-4" />}
      </Button>

      <div className="flex items-center justify-center flex-col gap-1 text-sm">
        <p className="text-[#3E4947] dark:text-zinc-400">{t("notReceived")}</p>

        <Button
          type="button"
          variant="ghost"
          disabled={!canResend || isResending || !email}
          onClick={handleResend}
          className="h-auto gap-1 px-2 py-1 text-sm font-semibold text-primary"
        >
          {isResending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <RotateCcw className="size-4" />
          )}

          <span>
            {canResend ? t("resend") : t("resendIn", { seconds: secondsLeft })}
          </span>
        </Button>
      </div>
    </form>
  );
}
