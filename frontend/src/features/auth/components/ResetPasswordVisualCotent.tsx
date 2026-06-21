import Image from "next/image";
import { useTranslations } from "next-intl";
import { Copyright, Gauge, ShieldCheck } from "lucide-react";

export function ResetPasswordVisualContent() {
  const t = useTranslations("Auth.resetPassword");
  return (
    <>
      <Image
        src="/assets/images/auth/reset-password-bg.png"
        alt="reset password background"
        fill
        priority
        sizes="50vw"
        className="absolute inset-0 object-cover"
      />

      <div className="relative z-10 flex h-full w-full flex-col justify-between px-20 py-10 text-white">
        <div className="w-45">
          <Image
            src="/assets/images/logos/logo-small.png"
            alt="logo"
            width={200}
            height={63}
            className="h-auto w-full"
          />
        </div>

        <div className="max-w-md">
          <h2 className="text-[40px] font-bold leading-tight whitespace-pre-line">
            {t("title")}
          </h2>

          <p className="mt-4 text-base font-serif leading-relaxed text-white/90 tracking-wide">
            {t("description")}
          </p>

          <div className="flex gap-4 mt-4">
            <div className="flex min-h-30 min-w-53 p-3 flex-col gap-2 rounded-lg border border-white/10 bg-white/10 backdrop-blur-2xl">
              <ShieldCheck className="size-6 text-[#9CF2E8]" />
              <h3 className="text-xl font-semibold text-white tracking-wide">
                {t("encryptionTitle")}
              </h3>

              <p className="mt-1 text-xs text-white/60">
                {t("encryptionDescription")}
              </p>
            </div>

            <div className="flex min-h-30 min-w-53 p-3 flex-col gap-2 rounded-lg border border-white/10 bg-white/10 backdrop-blur-2xl">
              <Gauge className="size-6 text-[#9CF2E8]" />
              <h3 className="text-xl font-semibold text-white tracking-wide">
                {t("speedTitle")}
              </h3>

              <p className="mt-1 text-xs text-white/60">
                {t("speedDescription")}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-white/75">
          <Copyright size={16} />
          <span>
            {new Date().getFullYear()} Rento Egypt. {t("copyright")}
          </span>
        </p>
      </div>
    </>
  );
}
