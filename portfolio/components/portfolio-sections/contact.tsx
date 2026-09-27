import { copy } from "@/lib/copy";
import { PixelIcon, type PixelIconName } from "@/components/retro/pixel-icon";
import { ContinuePrompt } from "@/components/retro/continue-prompt";
import { Mark, Section, SectionTitle } from "@/components/retro/ui";

const EMAIL = "joanherrol@gmail.com";

const SOCIALS: { icon: PixelIconName; label: string; href: string }[] = [
  { icon: "github", label: "GitHub", href: "https://github.com/joanherrol" },
  {
    icon: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/joanhervas/",
  },
  { icon: "itch", label: "itch.io", href: "https://joan-hervas.itch.io/" },
];

const CARD =
  "card-cream pixel-float pixel-button flex items-center hover:bg-pico-accent hover:text-cream";

export function Contact() {
  const details: {
    icon: PixelIconName;
    label: string;
    value: string;
    href: string;
  }[] = [
    {
      icon: "phone",
      label: copy.contact.phoneLabel,
      value: "+34 635 29 57 31",
      href: "tel:+34635295731",
    },
    {
      icon: "mail",
      label: copy.contact.emailLabel,
      value: EMAIL,
      href: `mailto:${EMAIL}`,
    },
  ];

  return (
    <Section id="contact" tone="dark" fill className="pb-(--band) text-center">
      <div className="flex-1" />
      <div className="flex flex-col items-center">
        <SectionTitle>
          {copy.contact.titleStart}
          <br />
          <Mark>{copy.contact.titleMark}</Mark>
        </SectionTitle>
        <ul
          data-reveal
          className="mt-(--gap-lg) grid w-fit max-w-full gap-8 text-left sm:grid-cols-[minmax(0,auto)_minmax(0,auto)] sm:gap-14"
        >
          {details.map((d) => (
            <li key={d.label} className="min-w-0">
              <a
                href={d.href}
                data-sound="ui"
                className={`${CARD} gap-8 px-8 py-6 text-body`}
              >
                <PixelIcon name={d.icon} />
                <span className="min-w-0">
                  <span className="block truncate text-body uppercase tracking-[0.125em]">
                    {d.label}
                  </span>
                  <span className="mt-2 block truncate text-body">
                    {d.value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <ul
          data-reveal
          className="mt-(--gap-md) flex flex-wrap justify-center gap-8"
        >
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                data-sound="ui"
                className={`${CARD} size-[round(up,48px,var(--ipx))] justify-center gap-6 text-body sm:w-auto sm:px-8`}
              >
                <PixelIcon name={social.icon} />
                <span className="hidden sm:inline">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-(--gap-md) type-label-md text-light-grey">
          © {new Date().getFullYear()} Joan Hervás Roldán
        </p>
      </div>

      {/* Centred above the characters, which stand at the bottom. */}
      <footer className="flex flex-1 items-center justify-center pt-(--gap-md) pb-[calc(max(var(--companion-scale),4)*var(--ipx)*11+12px)] uppercase">
        <a
          href="#home"
          data-sound="coin"
          className="type-body-lg uppercase tracking-[0.125em] hover:text-pop"
        >
          <span aria-live="polite">
            <ContinuePrompt />
          </span>
        </a>
      </footer>
    </Section>
  );
}
