import { Hero } from "@/components/portfolio-sections/hero";
import { About } from "@/components/portfolio-sections/about";
import {
  PROJECT_IDS,
  Projects,
} from "@/components/portfolio-sections/projects";
import { Skills } from "@/components/portfolio-sections/skills";
import { Education } from "@/components/portfolio-sections/education";
import { Contact } from "@/components/portfolio-sections/contact";
import { LevelMenu } from "@/components/retro/level-menu";
import { PaletteSwitcher } from "@/components/retro/palette-switcher";
import { PlayerCompanion } from "@/components/retro/player-companion";
import { SectionHash } from "@/components/retro/section-hash";
import { SoftSnap } from "@/components/retro/soft-snap";
import { copy } from "@/lib/copy";

export default function Home() {
  const levels = [
    { id: "home", label: copy.nav.home, code: "0-0" },
    { id: "about", label: copy.nav.about, code: "1-1" },
    ...PROJECT_IDS.map((id, i) => ({
      id,
      label: copy.projects.items[i].title,
      code: `2-${i + 1}`,
    })),
    { id: "skills", label: copy.nav.skills, code: "3-1" },
    { id: "education", label: copy.nav.education, code: "4-1" },
    { id: "contact", label: copy.nav.contact, code: "5-1" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PaletteSwitcher />
      <LevelMenu levels={levels} />
      <main className="flex-1">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <PlayerCompanion />
      <SoftSnap />
      <SectionHash />
    </div>
  );
}
