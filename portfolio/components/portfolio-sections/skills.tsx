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

      <div className="mt-(--gap-lg) grid gap-(--gap-md) md:grid-cols-2 md:gap-x-7">
        {skillGroups.map((g, i) => (
          <div
            key={copy.skills.categories[i]}
            data-reveal
            className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-3 md:grid-cols-1 md:gap-1"
          >
            <p className="text-body uppercase tracking-[0.2em] opacity-70">
              {copy.skills.categories[i]}
            </p>
            <ul className="flex flex-wrap gap-2 sm:gap-2">
              {g.skills.map((s) => (
                <li
                  key={s}
                  className={`px-2 py-1 text-body leading-none sm:px-2 sm:py-1 ${
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
          className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-3 md:grid-cols-1 md:gap-1"
        >
          <p className="text-body uppercase tracking-[0.2em] opacity-70">
            {copy.skills.languagesLabel}
          </p>
          <ul className="flex flex-wrap gap-x-7 gap-y-2 text-body">
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
