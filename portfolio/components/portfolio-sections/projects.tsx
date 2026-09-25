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
    id: "shootemup",
    image: "/imgs/ShootEmUp.png",
    width: 315,
    height: 250,
    pixelArt: true,
    url: "https://joan-hervas.itch.io/shootemup",
  },
  {
    id: "pug-adventure",
    image: "/imgs/PugAdventure.png",
    width: 315,
    height: 250,
    pixelArt: true,
    url: "https://joan-hervas.itch.io/pug-adventure",
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
            <div className="grid items-center gap-(--gap-lg) md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
              <div>
                <SectionLabel>2-{i + 1}</SectionLabel>
                <SectionTitle>
                  <Mark>{p.title}</Mark>
                </SectionTitle>
                <p
                  data-reveal
                  className="mt-(--gap-md) max-w-lg text-body leading-snug opacity-80"
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
                className={`mx-auto mt-4 w-full max-w-[min(100%,50svh)] md:mt-0 md:max-w-none ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
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
