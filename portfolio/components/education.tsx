"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/lib/i18n";

const educationMeta = [
  {
    institution: "Incheon National University",
    period: "2023",
    logo: "/imgs/Incheon_National_University.png",
  },
  {
    institution: "FIB, Universitat Politècnica de Catalunya",
    period: "2019 – 2024",
    logo: "/imgs/fib-upc-logo.png",
  },
  {
    institution: "Monlau Centre d'Estudis",
    period: "2017 – 2019",
    logo: "/imgs/monlau-esobat-cat.png",
  },
];

export function Education() {
  const { t } = useLocale();
  const education = t.education.items.map((item, i) => ({
    ...item,
    ...educationMeta[i],
  }));

  return (
    <section id="education" className="min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-16">
          {t.education.label}
        </p>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-0">
            {education.map((e, i) => (
              <div key={e.institution}>
                <div className="flex flex-col sm:flex-row gap-8 items-start py-12">
                  <div className="shrink-0 w-20 h-20 relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={e.logo}
                      alt={e.institution}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="text-lg font-semibold">{e.institution}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider shrink-0">
                        {e.period}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground/80">
                      {e.degree}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {e.description}
                    </p>
                    {e.gpa && <p className="text-sm font-semibold">{e.gpa}</p>}
                  </div>
                </div>
                {i < education.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
