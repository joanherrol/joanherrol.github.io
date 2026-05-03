"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/lib/i18n";

export function TechSection() {
  const { t } = useLocale();

  return (
    <section id="tech" className="min-h-screen flex flex-col bg-muted/30">
      <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
          {t.proovit.navSections.tech}
        </p>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-0">
            {t.proovit.tech.items.map((item, index) => {
              const isFeatured = index === 0;

              return (
                <div key={item.layer}>
                  <div className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:gap-12">
                    <div className="shrink-0 sm:w-44">
                      <p
                        className={`text-xs uppercase tracking-widest ${
                          isFeatured
                            ? "font-bold text-foreground"
                            : "font-medium text-muted-foreground"
                        }`}
                      >
                        {item.layer}
                      </p>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((technology) => (
                          <Badge
                            key={technology}
                            variant={isFeatured ? "default" : "secondary"}
                            className={isFeatured ? "px-3 py-1 text-sm" : ""}
                          >
                            {technology}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {index < t.proovit.tech.items.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
