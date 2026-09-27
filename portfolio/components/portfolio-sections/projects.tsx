import Image from "next/image";
import { copy } from "@/lib/copy";
import {
  Mark,
  PixelButton,
  Section,
  SectionTitle,
  WindowFrame,
  SectionLabel,
  type Tone,
} from "@/components/retro/ui";

const projectMeta = [
  {
    id: "pug-adventure",
    image: "/imgs/PugAdventure.png",
    width: 315,
    height: 250,
    pixelArt: true,
    url: "https://joan-hervas.itch.io/pug-adventure",
  },
  {
    id: "shootemup",
    image: "/imgs/ShootEmUp.png",
    width: 315,
    height: 250,
    pixelArt: true,
    url: "https://joan-hervas.itch.io/shootemup",
  },
];

export const PROJECT_IDS = projectMeta.map((p) => p.id);

export function Projects() {
  const projects = copy.projects.items.map((item, i) => ({
    ...item,
    ...projectMeta[i],
  }));

  return (
    <>
      {projects.map((p, i) => {
        const tone: Tone = i % 2 === 0 ? "dark" : "alt";
        return (
          <Section key={p.id} id={p.id} tone={tone} className="overflow-x-clip">
            <div className="grid items-center gap-(--gap-lg) md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
              <div>
                <SectionLabel>2-{i + 1}</SectionLabel>
                <SectionTitle>
                  <Mark>{p.title}</Mark>
                </SectionTitle>
                <p
                  data-reveal
                  className="mt-(--gap-md) max-w-170 text-body leading-snug"
                >
                  {p.description}
                </p>
                <div data-reveal className="mt-(--gap-md) flex">
                  <PixelButton href={p.url} external icon="external">
                    {p.cta}
                  </PixelButton>
                </div>
              </div>

              <WindowFrame
                title={p.image.split("/").pop()?.toLowerCase() ?? ""}
                tilt={i % 2 === 0 ? -1 : 1}
                delay={1.3 + i * 1.6}
                className="mx-auto mt-8 w-full max-w-[min(100%,50svh)] md:mt-0 md:max-w-none"
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="block h-auto w-full"
                  style={
                    p.pixelArt ? { imageRendering: "pixelated" } : undefined
                  }
                />
              </WindowFrame>
            </div>
          </Section>
        );
      })}
    </>
  );
}
