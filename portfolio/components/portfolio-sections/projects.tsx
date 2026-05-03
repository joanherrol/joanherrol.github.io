"use client";

import { useLocale } from "@/lib/i18n";
import { TiltCard } from "@/components/shared/tilt-card";

const projectMeta = [
  { image: "/imgs/Proovit.png", url: "/proovit" },
  {
    image: "/imgs/ShootEmUp.png",
    url: "https://joan-hervas.itch.io/shootemup",
  },
  {
    image: "/imgs/PugAdventure.png",
    url: "https://joan-hervas.itch.io/pug-adventure",
  },
];

export function Projects() {
  const { t } = useLocale();
  const projects = t.projects.items.map((item, i) => ({
    ...item,
    ...projectMeta[i],
  }));

  return (
    <section id="projects" className="min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
          {t.nav.projects}
        </p>
        <p className="text-base max-w-2xl mb-16">
          {t.projects.intro}{" "}
          <a
            href="https://github.com/joanherrol"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {t.projects.githubLabel}
          </a>
          .
        </p>
        <div className="flex-1 flex flex-col justify-center gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {projects.map((p) => (
              <TiltCard key={p.title} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
