import { copy } from "@/lib/copy";
import { PixelIcon, type PixelIconName } from "@/components/retro/pixel-icon";
import {
  Mark,
  Section,
  SectionLabel,
  SectionTitle,
} from "@/components/retro/ui";

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
  "card-cream flex items-center shadow-[4px_4px_0_0_#000] transition-[translate,box-shadow] duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-pico-accent hover:text-cream hover:shadow-[6px_6px_0_0_#000]";

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
    <Section id="contact" tone="dark" className="text-center">
      <div className="flex flex-col items-center">
        <SectionLabel>{copy.contact.label}</SectionLabel>
        <SectionTitle>
          {copy.contact.titleStart} <Mark>{copy.contact.titleMark}</Mark>
        </SectionTitle>
        <ul
          data-reveal
          className="mt-(--gap-lg) grid w-fit gap-4 text-left sm:grid-cols-2 sm:gap-7"
        >
          {details.map((d) => (
            <li key={d.label}>
              <a href={d.href} className={`${CARD} gap-4 px-4 py-3`}>
                <PixelIcon name={d.icon} size={3} />
                <span className="min-w-0">
                  <span className="block text-body uppercase tracking-widest">
                    {d.label}
                  </span>
                  <span className="mt-1 block text-body">{d.value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <ul
          data-reveal
          className="mt-(--gap-md) flex flex-wrap justify-center gap-4"
        >
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`${CARD} h-[48px] w-[48px] justify-center gap-3 sm:w-auto sm:px-4 text-body`}
              >
                <PixelIcon name={social.icon} size={3} />
                <span className="hidden sm:inline">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-(--gap-lg) flex flex-col items-center gap-3 text-body uppercase tracking-widest">
        <span className="opacity-70">
          © {new Date().getFullYear()} Joan Hervás Roldán
        </span>
        <a href="#home" className="hover:text-pop">
          {copy.contact.backToTop}
        </a>
      </footer>
    </Section>
  );
}
