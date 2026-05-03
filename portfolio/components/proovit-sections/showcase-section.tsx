"use client";

import Image from "next/image";
import { Smartphone } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { PhoneShowcase } from "./phone-showcase";

export function ShowcaseSection() {
  const { t } = useLocale();

  return (
    <section
      id="showcase"
      className="min-h-screen flex flex-col bg-black text-white"
    >
      <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <div className="flex-1 grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,420px)_auto] lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-8">
              <h1 className="sr-only">{t.proovit.hero.title}</h1>
              <Image
                src="/proovit/ProovitLogo.svg"
                alt={t.proovit.hero.logoAlt}
                width={422}
                height={98}
                className="h-auto w-[180px] sm:w-[220px] md:w-[260px]"
                priority
              />
              <p className="text-base leading-relaxed text-white/60 sm:text-lg">
                {t.proovit.hero.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={t.proovit.links.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/30 bg-transparent px-3 sm:px-7 text-sm sm:text-base font-medium text-white transition-all duration-200 hover:bg-[#d50032] hover:border-[#d50032]"
              >
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.proovit.links.playStoreLabel}
              </a>
            </div>
          </div>

          <PhoneShowcase />
        </div>
      </div>
    </section>
  );
}
