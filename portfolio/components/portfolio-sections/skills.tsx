"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/lib/i18n";

const skillGroups = [
  {
    featured: true,
    skills: [
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Tanstack React Query",
    ],
  },
  {
    featured: false,
    skills: ["REST APIs", ".NET (C#)", "Entity Framework", "SQL Server"],
  },
  { featured: false, skills: ["React Native", "Expo"] },
  {
    featured: false,
    skills: ["AZ-204 Certified", "CI/CD", "Infrastructure as Code"],
  },
  { featured: false, skills: ["Unity", "C#"] },
];

export function Skills() {
  const { t } = useLocale();
  return (
    <section id="skills" className="min-h-screen flex flex-col bg-muted/30">
      <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
          {t.nav.skills}
        </p>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-0">
            {skillGroups.map((g, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12 py-10">
                  <p
                    className={`text-xs uppercase tracking-widest shrink-0 w-36 ${
                      g.featured
                        ? "font-bold text-foreground"
                        : "font-medium text-muted-foreground"
                    }`}
                  >
                    {t.skills.categories[i]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {g.skills.map((s) => (
                      <Badge
                        key={s}
                        variant={g.featured ? "default" : "secondary"}
                        className={g.featured ? "text-sm px-3 py-1" : ""}
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                {i < skillGroups.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
            <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground shrink-0 w-36">
              {t.skills.languagesLabel}
            </p>
            <div className="flex flex-wrap gap-6">
              {t.skills.languagesList.map((l) => (
                <span key={l.name} className="text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-muted-foreground"> — {l.note}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
