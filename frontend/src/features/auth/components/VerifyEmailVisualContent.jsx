import Image from "next/image";
import { useTranslations } from "next-intl";
import { Copyright } from "lucide-react";


export function VerifyEmailVisualContent() {
  const t = useTranslations("Auth.verifyEmail");

  return (
    <>
      <div className="absolute inset-0 z-0 bg-linear-to-br from-[#005C55]/90 via-[#004740]/85 to-[#00201D]/95" />
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

          <p className="mt-14 text-base font-serif leading-relaxed text-white/90 tracking-wide">
            {t("description")}
          </p>

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
