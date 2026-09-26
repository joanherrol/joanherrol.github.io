import Image from "next/image";
import { copy } from "@/lib/copy";
import { PixelIcon } from "@/components/retro/pixel-icon";
import {
  Mark,
  Section,
  SectionLabel,
  SectionTitle,
} from "@/components/retro/ui";

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
  const education = copy.education.items.map((item, i) => ({
    ...item,
    ...educationMeta[i],
  }));

  return (
    <Section id="education" tone="alt">
      <SectionLabel>{copy.education.label}</SectionLabel>
      <SectionTitle>
        {copy.education.titleStart} <Mark>{copy.education.titleMark}</Mark>
      </SectionTitle>

      <ol className="mt-(--gap-lg) flex flex-col gap-(--gap-md)">
        {education.map((e) => (
          <li
            key={e.institution}
            data-reveal
            className="card-cream grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2 p-2 pixel-shadow-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-3"
          >
            <div className="relative h-[48px] w-[48px] shrink-0 bg-cream sm:h-[80px] sm:w-[80px]">
              <Image
                src={e.logo}
                alt={e.institution}
                fill
                sizes="(min-width: 640px) 80px, 48px"
                className="object-contain p-1"
              />
            </div>
            <div>
              <h3 className="text-large leading-tight">{e.institution}</h3>
              <p className="mt-1 text-body">{e.degree}</p>
              <p className="mt-1 hidden text-body leading-snug opacity-75 [@media(min-width:80rem)_and_(min-height:55rem)]:block">
                {e.description}
              </p>
            </div>
            <div className="col-span-2 flex flex-row items-center justify-between gap-3 max-sm:[@media(min-height:50rem)]:mt-2 sm:col-span-1 sm:flex-col sm:items-end sm:justify-start">
              <span className="text-body">{e.period}</span>
              {e.gpa && (
                <span className="card-accent flex items-center gap-2 px-2 py-1 text-body uppercase">
                  <PixelIcon name="star" />
                  {e.gpa}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
