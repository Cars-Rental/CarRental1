import { Footer } from "@/components/layout/Footer";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <LandingNavbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
