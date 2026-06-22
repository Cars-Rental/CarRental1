import Image from "next/image";
import { useTranslations } from "next-intl";
import { Copyright, ShieldCheck } from "lucide-react";

export function ForgotVisualContent() {
  const t = useTranslations("Auth.forgotPassword");

  return (
    <>
      <Image
        src="/assets/images/auth/forget-password-bg.png"
        alt="Forgot password background"
        width={385}
        height={385}
        className="absolute -bottom-10 left-0 h-100 w-full object-cover object-bottom"
      />
      <div className="absolute inset-0 z-0 bg-linear-to-br from-[#005C55]/90 via-[#004740]/85 to-[#00201D]/95" />
      <div className="relative z-10 flex w-full flex-col justify-between px-14 py-12 text-white">
        <div className="w-45">
          <Image
            src="/assets/images/logos/logo-small.png"
            alt="Rento Logo"
            width={200}
            height={63}
            className="h-auto w-full"
          />
        </div>
        <p className="mt-3 text-sm text-white/70">{t("description")}</p>

        <div className="relative flex flex-1 items-end justify-end pb-24">
          <div className="relative z-10 max-w-sm rounded-lg border border-white/10 p-4 shadow-xl backdrop-blur-xl">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="size-6 text-[#9CF2E8]" />
              <h3 className="text-xl font-semibold">{t("securityTitle")}</h3>
            </div>

            <p className="text-sm leading-6 text-white/75">
              {t("securityDescription")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/80">
          <Copyright className="size-4" />
          <span>
            {new Date().getFullYear()} Rento Egypt. {t("copyright")}
            </span>
        </div>
      </div>
    </>
  );
}
