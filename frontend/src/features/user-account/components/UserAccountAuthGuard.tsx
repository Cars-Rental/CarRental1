"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectIsLoading } from "@/features/auth/store";

export function UserAccountAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const t = useTranslations("UserAccount");
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 dark:bg-slate-950">
        <div className="flex items-center gap-3 text-sm text-muted-foreground dark:text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t("auth.checking")}</span>
        </div>
      </div>
    );
  }

  return children;
}
