import { useLocale } from "next-intl";

export function useDirection() {
  const locale = useLocale();

  return {
    locale,
    isRTL: locale === "ar",
    isLTR: locale === "en",
  };
}