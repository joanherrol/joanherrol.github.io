"use client";

import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { ParticlesBackground } from "@/components/particles-background";
import { useLocale } from "@/lib/i18n";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const { t } = useLocale();
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden"
    >
      <ParticlesBackground />
      <div className="max-w-5xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Joan Hervás
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light">
                {t.hero.subtitle}
              </p>
            </div>

            <p className="max-w-md text-muted-foreground leading-relaxed">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => scrollTo("projects")}>
                {t.hero.viewProjects}
              </Button>
              <Button variant="outline" asChild>
                <a href="/docs/CVJoanHervas.pdf" download>
                  {t.hero.downloadCV}
                </a>
              </Button>
            </div>

            <div className="flex gap-5 pt-2">
              <a
                href="https://www.linkedin.com/in/joanhervas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/joanherrol"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://joan-hervas.itch.io/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="itch.io"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Gamepad2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-10 md:gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold tracking-tight">2+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                {t.hero.yearsExperience}
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold tracking-tight">10+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                {t.hero.projectsDelivered}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
