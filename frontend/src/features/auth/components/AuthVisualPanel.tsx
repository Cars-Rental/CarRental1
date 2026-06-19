import Image from "next/image";
import { BadgeCheck, Banknote, Copyright, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";

interface AuthVisualPanelProps {
  title: string;
  description: string;
}

const features = [
  {
    key: "trustedCars",
    icon: BadgeCheck,
  },
  {
    key: "bestPrices",
    icon: Banknote,
  },
  {
    key: "support",
    icon: Headphones,
  },
];

export function AuthVisualPanel({ title, description }: AuthVisualPanelProps) {
  const t = useTranslations("Auth");

  return (
    <section className="relative hidden overflow-hidden bg-[#005C55] lg:flex">
      <Image
        src="/assets/images/auth/register-bg.png"
        alt="register background"
        fill
        priority
        sizes="50vw"
        className="absolute inset-0 object-cover"
      />

      <div className="relative z-10 flex h-full w-full flex-col justify-between px-20 py-10 text-white">
        <Image
          src="/assets/images/logos/logo-small.png"
          alt="logo"
          width={200}
          height={200}
        />

        <div className="max-w-md">
          <h2 className="text-[40px] font-bold leading-tight">{title}</h2>

          <ul className="mt-8 space-y-5">
            {features.map(({ key, icon: Icon }) => (
              <li key={key} className="flex items-center gap-4 text-base">
                <span className="flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                  <Icon size={22} />
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-white/75">
          <Copyright size={16} />
          <span>
            {new Date().getFullYear()} Rento Egypt. {t("copyright")}
          </span>
        </p>
      </div>
    </section>
  );
}
