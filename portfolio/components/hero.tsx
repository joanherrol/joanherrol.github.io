"use client";

import { Button } from "@/components/ui/button";
import { Gamepad2, ArrowRight, Download } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { ParticlesBackground } from "@/components/particles-background";
import { useLocale } from "@/lib/i18n";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const { t, locale } = useLocale();
  const cvHref = locale === "es" ? "/docs/CV_JoanHervas_Spanish.pdf" : "/docs/CV_JoanHervas_English.pdf";
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden"
    >
      <ParticlesBackground />
      <div className="max-w-5xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-stretch justify-between gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
                Joan Hervás
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light">
                {t.hero.subtitle}
              </p>
            </div>

            <p className="max-w-md text-muted-foreground leading-relaxed">
              {t.hero.description}
            </p>

            <div className="flex gap-3 w-full md:max-w-md">
              <Button
                onClick={() => scrollTo("projects")}
                className="cursor-pointer h-12 px-3 sm:px-7 text-sm sm:text-base gap-2 active:scale-95 transition-transform flex-1 min-w-0"
              >
                {t.hero.viewProjects}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-12 px-3 sm:px-7 text-sm sm:text-base gap-2 active:scale-95 transition-transform flex-1 min-w-0"
              >
                <a href={cvHref} download>
                  <Download className="h-4 w-4 transition-transform duration-200 group-hover/button:-translate-y-0.5" />
                  {t.hero.downloadCV}
                </a>
              </Button>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full md:max-w-md">
              <a
                href="https://www.linkedin.com/in/joanhervas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 h-10 rounded-lg border border-border bg-background text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95 transition-transform"
              >
                <LinkedInIcon className="h-4 w-4 shrink-0" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/joanherrol"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 h-10 rounded-lg border border-border bg-background text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95 transition-transform"
              >
                <GitHubIcon className="h-4 w-4 shrink-0" />
                <span>GitHub</span>
              </a>
              <a
                href="https://joan-hervas.itch.io/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="itch.io"
                className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 h-10 rounded-lg border border-border bg-background text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95 transition-transform"
              >
                <Gamepad2 className="h-4 w-4 shrink-0" />
                <span>itch.io</span>
              </a>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-center md:justify-between gap-10 md:gap-0 w-full md:w-auto mt-16 md:mt-0 md:py-8">
            <div className="text-center">
              <p className="text-4xl font-bold tracking-tight">3+</p>
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
