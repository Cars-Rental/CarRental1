"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { ROLES } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from "@/features/auth/store";

interface TraderAuthGuardProps {
  children: React.ReactNode;
}

export function TraderAuthGuard({ children }: TraderAuthGuardProps) {
  const router = useRouter();
  const t = useTranslations("TraderDashboard.auth");
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || user?.role !== ROLES.TRADER) {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, isLoading, router, user?.role]);

  if (isLoading || !isAuthenticated || user?.role !== ROLES.TRADER) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t("checking")}</span>
        </div>
      </div>
    );
  }

  return children;
}
