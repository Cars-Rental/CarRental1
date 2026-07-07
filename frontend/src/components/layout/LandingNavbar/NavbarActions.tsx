import { useSyncExternalStore } from "react";
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

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function NavbarActions() {
  const {user, isLoading} = useAppSelector((state) => state.auth);
  const isMounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <div className="flex items-center gap-0 sm:gap-2.5">
      <ThemeToggle />
      <LanguageToggle />
      {!isMounted || isLoading ? (
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
