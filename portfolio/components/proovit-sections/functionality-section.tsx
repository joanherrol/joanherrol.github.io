"use client";

import {
  Bell,
  Bot,
  Camera,
  RefreshCw,
  Trophy,
  Type,
  Users,
} from "lucide-react";
import { useLocale } from "@/lib/i18n";

const featureIcons = [RefreshCw, Camera, Bot, Users, Trophy, Bell];

export function FunctionalitySection() {
  const { t } = useLocale();

  return (
    <section
      id="functionality"
      className="min-h-screen flex flex-col bg-muted/30"
    >
      <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
          {t.proovit.navSections.functionality}
        </p>

        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {t.proovit.features.items.map((item, index) => {
              const Icon = featureIcons[index] ?? Type;
              return (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-3xl border border-border/70 bg-background p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d50032]/50 hover:shadow-[0_18px_42px_rgb(0,0,0,0.12)]"
                >
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d50032]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d50032]/10 text-[#d50032] ring-1 ring-[#d50032]/15">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-medium text-muted-foreground/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
