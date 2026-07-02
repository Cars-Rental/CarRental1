import { AboutHero } from "./AboutHero";
import { AboutMission } from "./AboutMission";
import { AboutValues } from "./AboutValues";
import { AboutCTA } from "./AboutCTA";

export function AboutPage() {
  return (
    <main className="min-h-screen bg-background dark:bg-slate-950">
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutCTA />
    </main>
  );
}
