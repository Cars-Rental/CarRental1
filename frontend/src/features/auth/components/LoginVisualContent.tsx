import Image from "next/image";
import { useTranslations } from "next-intl";
import { Copyright } from "lucide-react";

export function LoginVisualContent() {
  const t = useTranslations("Auth.login");
  return (
    <>
      <Image
        src="/assets/images/auth/login-bg.png"
        alt="login background"
        width={385}
        height={385}
        className="absolute bottom-0 left-0 object-cover"
      />
      {/* overlay */}
      <div className="absolute inset-0 bg-[#005C55]/60 z-0" />
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
            <div className="flex min-h-20 min-w-53 p-3 flex-col rounded-lg border border-white/10 bg-white/10 backdrop-blur-2xl">
              <h3 className="text-2xl font-bold text-white tracking-wide">
                {t("carsCount")}
              </h3>

              <p className="mt-1 text-xs text-white/60">{t("carsDesc")}</p>
            </div>

            <div className="flex min-h-20 min-w-53 p-3 flex-col rounded-lg border border-white/10 bg-white/10 backdrop-blur-2xl">
              <h3 className="text-2xl font-bold text-white tracking-wide">
                {t("reviewspercentage")}
              </h3>

              <p className="mt-1 text-xs text-white/60">{t("reviewsDesc")}</p>
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
