"use client";

import { Button } from "@/components/ui/button";
import { Gamepad2, ArrowRight, Download } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/icons";
import { SocialLink } from "@/components/shared/social-link";
import { ParticlesBackground } from "@/components/shared/particles-background";
import { useLocale } from "@/lib/i18n";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const { t, locale } = useLocale();
  const cvHref =
    locale === "es"
      ? "/docs/CV_JoanHervas_Spanish.pdf"
      : "/docs/CV_JoanHervas_English.pdf";
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden"
    >
      <ParticlesBackground scrollFade />
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
                className="cursor-pointer h-12 text-sm sm:text-base flex-1 gap-4"
              >
                {t.hero.viewProjects}
                <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-12 text-sm sm:text-base flex-1 gap-4"
              >
                <a href={cvHref} download>
                  <Download className="transition-transform duration-200 group-hover/button:scale-114" />
                  {t.hero.downloadCV}
                </a>
              </Button>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full md:max-w-md">
              <SocialLink
                href="https://www.linkedin.com/in/joanhervas/"
                label="LinkedIn"
              >
                <LinkedInIcon className="h-4 w-4 shrink-0" />
                <span>LinkedIn</span>
              </SocialLink>
              <SocialLink href="https://github.com/joanherrol" label="GitHub">
                <GitHubIcon className="h-4 w-4 shrink-0" />
                <span>GitHub</span>
              </SocialLink>
              <SocialLink href="https://joan-hervas.itch.io/" label="itch.io">
                <Gamepad2 className="h-4 w-4 shrink-0" />
                <span>itch.io</span>
              </SocialLink>
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
