import {
  ThemeToggle,
  LanguageToggle,
} from "@/components/shared";

import { AuthButtons } from "./AuthButtons";
import { useAppSelector } from "@/store/hooks";
import { ProfileDropdown } from "@/features/auth/components";
import { NavbarActionsSkeleton } from "./NavbarActionsSkeleton";
import { ROLES } from "@/constants";
import { UserNotificationBell } from "@/features/notifications";

export function NavbarActions() {
  const {user, isLoading} = useAppSelector((state) => state.auth);

  return (
    <div className="flex items-center gap-2.5">
      <ThemeToggle />
      <LanguageToggle />
      {isLoading ? (
        <NavbarActionsSkeleton />
      ) : user ? (
        <>
          {user.role === ROLES.USER && <UserNotificationBell />}
          <ProfileDropdown />
        </>
      ) : (
        <AuthButtons />
      )}
    </div>
  );
}
