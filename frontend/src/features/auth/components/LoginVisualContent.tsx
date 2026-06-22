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
        className="absolute bottom-0 left-0  object-cover"
      />
      <div className="relative z-10 flex h-full w-full flex-col justify-center px-20 py-10 text-white">
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
          <h2 className="text-[40px] font-bold leading-tight">{t("title")}</h2>

          <p className="mt-4 text-base font-serif">{t("description")}</p>
        </div>
      </div>
     
    </>
  );
}
