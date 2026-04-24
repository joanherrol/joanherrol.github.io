"use client";

import Image from "next/image";
import { Download, ChevronRight } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function About() {
  const { t, locale } = useLocale();
  const cvHref =
    locale === "es"
      ? "/docs/CV_JoanHervas_Spanish.pdf"
      : "/docs/CV_JoanHervas_English.pdf";
  return (
    <section id="about" className="min-h-screen flex flex-col bg-muted/30">
      <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
          {t.nav.about}
        </p>

        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="flex flex-col md:flex-row gap-12 items-stretch">
            <div className="shrink-0 relative w-full max-w-xs mx-auto md:max-w-none md:mx-0 md:w-48 rounded-xl overflow-hidden aspect-[3/4] md:aspect-auto min-h-[200px]">
              <Image
                src="/imgs/portrait.png"
                alt="Joan Hervás"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-4 flex-1">
              <p className="text-base leading-relaxed">{t.about.p1}</p>
              <p className="text-base leading-relaxed">{t.about.p2}</p>
              <p className="text-base leading-relaxed">{t.about.p3}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href={cvHref}
              download
              className="group inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-foreground hover:text-background hover:border-foreground active:scale-95"
            >
              <Download className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
              <span>{t.about.downloadCV}</span>
              <ChevronRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
