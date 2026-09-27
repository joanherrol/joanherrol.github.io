import Image from "next/image";
import { copy } from "@/lib/copy";
import { FitNotes } from "@/components/retro/fit-notes";
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
    institution: "FIB, UPC",
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
      <FitNotes />
      <SectionLabel>{copy.education.label}</SectionLabel>
      <SectionTitle>
        {copy.education.titleStart} <Mark>{copy.education.titleMark}</Mark>
      </SectionTitle>

      <ol className="mt-(--gap-lg) flex flex-col gap-(--gap-md)">
        {education.map((e) => (
          // Reveals move the wrapper: a moving card would lift its own shadow.
          <li key={e.institution} data-reveal>
            <div className="card-cream pixel-flat grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 p-4 min-[40rem]:grid-cols-[auto_minmax(0,1fr)_auto] min-[40rem]:items-center sm:gap-8 sm:p-6">
              <div className="relative size-24 shrink-0 sm:size-26">
                <Image
                  src={e.logo}
                  alt={e.institution}
                  fill
                  sizes="(min-width: 640px) 78px, 48px"
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h3 className="type-body-lg">{e.institution}</h3>
                <p className="mt-2 text-body">{e.degree}</p>
                <p className="mt-2 type-body-sm text-dark-grey in-data-crowded:hidden">
                  {e.description}
                </p>
              </div>
              <div className="col-span-2 flex flex-row items-center justify-between gap-6 [@media(width<40rem)_and_(min-height:50rem)]:mt-4 min-[40rem]:col-span-1 min-[40rem]:flex-col min-[40rem]:items-end min-[40rem]:justify-start">
                <span className="text-body">{e.period}</span>
                {e.gpa && (
                  <span className="card-accent flex items-center gap-4 px-4 py-2 text-body uppercase">
                    <PixelIcon name="star" />
                    {e.gpa}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
