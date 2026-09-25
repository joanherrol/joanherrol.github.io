import Image from "next/image";
import { copy } from "@/lib/copy";
import {
  Mark,
  PixelButton,
  Section,
  SectionLabel,
  ConsoleFrame,
  SectionTitle,
} from "@/components/retro/ui";

const CV_HREF = "/docs/CV_JoanHervas_English.pdf";

export function About() {
  return (
    <Section id="about" tone="alt">
      <div className="grid items-center gap-(--gap-lg) lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <SectionLabel>{copy.about.label}</SectionLabel>
          <SectionTitle>
            {copy.about.titleStart} <Mark>{copy.about.titleMark}</Mark>
          </SectionTitle>
          <p
            data-reveal
            className="mt-(--gap-md) max-w-xl text-body leading-snug opacity-80"
          >
            {copy.about.body}
          </p>

          <div data-reveal className="mt-(--gap-md) flex">
            <PixelButton href={CV_HREF} download icon="download">
              {copy.about.downloadCV}
            </PixelButton>
          </div>
        </div>

        <ConsoleFrame
          title="P1"
          className="mx-auto mt-4 w-full max-w-[min(92%,56svh)] lg:mt-0 rotate-2 sm:max-w-[min(34rem,80svh)]"
        >
          <div className="relative aspect-square">
            <Image
              src="/imgs/portrait.jpg"
              alt="Joan Hervás"
              fill
              sizes="320px"
              className="object-cover object-[center_25%]"
            />
          </div>
        </ConsoleFrame>
      </div>
    </Section>
  );
}
