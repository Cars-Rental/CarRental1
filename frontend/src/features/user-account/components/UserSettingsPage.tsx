"use client";

import { Bell, Globe, LockKeyhole, ShieldAlert, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageToggle, ThemeToggle } from "@/components/shared";
import { mockUserSettings } from "../utils";
import { UserAccountLayout } from "./UserAccountLayout";
import { UserAccountPageHeader } from "./UserAccountPageHeader";

export function UserSettingsPage() {
  const t = useTranslations("UserAccount");
  const settings = mockUserSettings;

  return (
    <UserAccountLayout>
      <UserAccountPageHeader
        title={t("settings.title")}
        description={t("settings.description")}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SettingsSection
          icon={UserRound}
          title={t("settings.sections.profile")}
          description={t("settings.profileDescription")}
        >
          <Button variant="outline">{t("settings.manageProfile")}</Button>
        </SettingsSection>

        <SettingsSection
          icon={LockKeyhole}
          title={t("settings.sections.security")}
          description={t("settings.securityDescription")}
        >
          <Button variant="outline">{t("settings.changePassword")}</Button>
        </SettingsSection>

        <SettingsSection
          icon={Bell}
          title={t("settings.sections.notifications")}
          description={t("settings.notificationsDescription")}
        >
          <div className="space-y-2 text-sm">
            <SettingState
              label={t("settings.emailNotifications")}
              enabled={settings.emailNotifications}
            />
            <SettingState
              label={t("settings.smsNotifications")}
              enabled={settings.smsNotifications}
            />
            <SettingState
              label={t("settings.marketingNotifications")}
              enabled={settings.marketingNotifications}
            />
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Globe}
          title={t("settings.sections.language")}
          description={t("settings.languageDescription")}
        >
          <LanguageToggle />
        </SettingsSection>

        <SettingsSection
          icon={Globe}
          title={t("settings.sections.theme")}
          description={t("settings.themeDescription")}
        >
          <ThemeToggle />
        </SettingsSection>

        <SettingsSection
          icon={ShieldAlert}
          title={t("settings.sections.dangerZone")}
          description={t("settings.dangerDescription")}
        >
          <Button variant="destructive">{t("settings.deleteAccount")}</Button>
        </SettingsSection>
      </div>
    </UserAccountLayout>
  );
}

interface SettingsSectionProps {
  children: React.ReactNode;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

function SettingsSection({
  children,
  description,
  icon: Icon,
  title,
}: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        {children}
      </CardContent>
    </Card>
  );
}

function SettingState({
  enabled,
  label,
}: {
  enabled: boolean;
  label: string;
}) {
  const t = useTranslations("UserAccount");

  return (
    <div className="flex items-center justify-between rounded-md border border-border p-3">
      <span>{label}</span>
      <span className="text-xs font-medium text-muted-foreground">
        {enabled ? t("settings.enabled") : t("settings.disabled")}
      </span>
    </div>
  );
}
