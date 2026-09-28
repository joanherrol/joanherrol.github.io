import { copy } from "@/lib/copy";
import {
  Mark,
  Section,
  SectionLabel,
  SectionTitle,
} from "@/components/retro/ui";

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
  return (
    <Section id="skills" tone="dark">
      <SectionLabel>{copy.skills.label}</SectionLabel>
      <SectionTitle>
        {copy.skills.titleStart} <Mark>{copy.skills.titleMark}</Mark>
      </SectionTitle>

      <div className="mt-(--gap-lg) grid gap-(--gap-md) md:grid-cols-2 md:gap-x-14">
        {skillGroups.map((g, i) => (
          <div
            key={copy.skills.categories[i]}
            data-reveal
            className="grid grid-cols-[calc(var(--p)*60)_minmax(0,1fr)] items-start gap-6 md:grid-cols-1 md:gap-2"
          >
            <p className="type-label-md leading-snug text-light-grey">
              {copy.skills.categories[i]}
            </p>
            <ul className="flex flex-wrap gap-4">
              {g.skills.map((s) => (
                <li
                  key={s}
                  className={`pixel-cut pixel-face px-3 py-2 text-body leading-none sm:px-4 ${
                    g.featured ? "card-accent" : "card-cream"
                  }`}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div
          data-reveal
          className="grid grid-cols-[calc(var(--p)*60)_minmax(0,1fr)] items-start gap-6 md:grid-cols-1 md:gap-2"
        >
          <p className="type-label-md leading-snug text-light-grey">
            {copy.skills.languagesLabel}
          </p>
          <ul className="flex flex-wrap gap-x-14 gap-y-4 text-body">
            {copy.skills.languagesList.map((l) => (
              <li key={l.name}>
                <span>{l.name}</span>{" "}
                <span className="text-body uppercase text-pop">{l.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
