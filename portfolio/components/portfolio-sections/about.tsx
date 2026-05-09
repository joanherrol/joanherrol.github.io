"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-stretch">
            <div className="shrink-0 relative mx-auto w-48 h-64 rounded-xl overflow-hidden">
              <Image
                src="/imgs/portrait.jpg"
                alt="Joan Hervás"
                fill
                sizes="192px"
                className="object-cover"
                loading="eager"
              />
            </div>

            <div className="space-y-4 flex-1">
              <p className="text-base leading-relaxed">{t.about.p1}</p>
              <p className="text-base leading-relaxed">{t.about.p2}</p>
              <p className="text-base leading-relaxed">{t.about.p3}</p>
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 mt-12">
            <Button
              variant="secondary"
              className="h-10 text-base hover:bg-foreground hover:text-background hover:border-foreground"
              asChild
            >
              <Link href="/gallery">
                <ImageIcon className="h-4 w-4" />
                {t.about.galleryButton}
              </Link>
            </Button>
            <Button
              variant="secondary"
              className="h-10 text-base hover:bg-foreground hover:text-background hover:border-foreground"
              asChild
            >
              <a href={cvHref} download>
                <Download className="h-4 w-4" />
                {t.about.downloadCV}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
