import { UserAccountAuthGuard } from "./UserAccountAuthGuard";

interface UserAccountLayoutProps {
  children: React.ReactNode;
}

export function UserAccountLayout({ children }: UserAccountLayoutProps) {
  return (
    <UserAccountAuthGuard>
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </UserAccountAuthGuard>
  );
}
