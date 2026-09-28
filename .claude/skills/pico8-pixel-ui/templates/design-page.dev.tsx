import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PIXEL_ICONS, PixelIcon } from "@/components/retro/pixel-icon";
import {
  ConsoleFrame,
  DropText,
  Mark,
  PixelButton,
  PixelShadow,
  TitleBar,
  WindowFrame,
  dropdown,
} from "@/components/retro/ui";
import { Tuner } from "./tuner";

// Development only: the page.dev.tsx name keeps it out of production builds.
export const metadata: Metadata = {
  title: "Design sheet",
  robots: { index: false },
};

const COLORS = [
  ["black", "dark-blue", "dark-purple", "dark-green"],
  ["brown", "dark-grey", "light-grey", "white"],
  ["red", "orange", "yellow", "green"],
  ["blue", "lavender", "pink", "peach"],
  ["darkest-brown", "darker-blue", "darker-purple", "blue-green"],
  ["dark-brown", "darker-grey", "medium-grey", "light-yellow"],
  ["dark-red", "dark-orange", "lime-green", "medium-green"],
  ["true-blue", "mauve", "dark-peach", "light-peach"],
].flat();

const ROLES = [
  ["Background", "--pico-bg"],
  ["Background 2", "--pico-bg2"],
  ["Accent", "--pico-accent"],
];

const TYPE = [
  {
    id: "display",
    font: "Press Start 2P",
    sample: "Press start",
  },
  {
    id: "headline",
    font: "Press Start 2P",
    sample: "Level clear",
  },
  {
    id: "title",
    font: "Press Start 2P",
    sample: "Player one ready",
  },
  {
    id: "body",
    font: "Tiny5",
    sample: "The quick pixel fox jumps over the lazy sprite, 0123456789.",
  },
  {
    id: "label",
    font: "Tiny5",
    sample: "Score",
  },
] as const;

const SIZES = ["lg", "md", "sm"] as const;

// Spelled out so Tailwind sees every class.
const TYPE_CLASS: Record<string, string> = {
  "display-lg": "type-display-lg",
  "display-md": "type-display-md",
  "display-sm": "type-display-sm",
  "headline-lg": "type-headline-lg",
  "headline-md": "type-headline-md",
  "headline-sm": "type-headline-sm",
  "title-lg": "type-title-lg",
  "title-md": "type-title-md",
  "title-sm": "type-title-sm",
  "body-lg": "type-body-lg",
  "body-md": "type-body-md",
  "body-sm": "type-body-sm",
  "label-lg": "type-label-lg",
  "label-md": "type-label-md",
  "label-sm": "type-label-sm",
};

const SPACES = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];

function Block({
  title,
  note,
  children,
}: Readonly<{ title: string; note?: string; children: ReactNode }>) {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="relative type-headline-md">
          <DropText>{title}</DropText>
        </h2>
        {note && <p className="type-body-md text-light-grey">{note}</p>}
      </div>
      {children}
    </section>
  );
}

// Stands in for any picture a frame holds.
function Placeholder() {
  return (
    <div className="flex aspect-square items-center justify-center bg-blue-green type-display-sm text-green">
      <PixelIcon name="itch" />
    </div>
  );
}

function Caption({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="type-label-md text-light-grey">{children}</p>;
}

export default function DesignSheet() {
  return (
    <main className="tone-dark section-paper relative min-h-screen px-6 py-16 sm:px-16">
      <div className="mx-auto grid max-w-384 gap-16 lg:grid-cols-[minmax(0,1fr)_calc(var(--p)*100)]">
        <div className="flex min-w-0 flex-col gap-24">
          <header className="flex flex-col gap-4">
            <p className="type-label-md text-light-grey">Dev only</p>
            <h1 className="relative type-display-md">
              <DropText>
                Design <Mark>sheet</Mark>
              </DropText>
            </h1>
            <p className="type-body-lg">
              Every token and component, live. Resize the window to see each
              breakpoint.
            </p>
          </header>

          <Block
            title="Type"
            note="Press Start for display, headline and title; Tiny5 for body and label. Each in large, medium and small; font size is always 8 glyph pixels."
          >
            <div className="flex flex-col gap-16">
              {TYPE.map((t) => (
                <div key={t.id} className="flex flex-col gap-8">
                  <Caption>
                    {t.id} · {t.font}
                  </Caption>
                  {SIZES.map((size) => (
                    <div key={size} className="flex flex-col gap-2">
                      <p className="type-label-sm text-light-grey">
                        {size} · <span data-measure={`type-${t.id}-${size}`} />
                      </p>
                      <p
                        id={`type-${t.id}-${size}`}
                        className={`${TYPE_CLASS[`${t.id}-${size}`]} min-w-0 break-words`}
                      >
                        {t.sample}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Block>

          <Block
            title="Colour"
            note="The 32 PICO-8 colours, standard then secret, and the three roles a theme sets."
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {COLORS.map((c) => (
                <div key={c} className="flex items-center gap-4">
                  <span
                    data-hex
                    className="size-12 shrink-0"
                    style={{ background: `var(--color-${c})` }}
                  />
                  <span className="type-body-md leading-tight">
                    {c}
                    <br />
                    <span data-hex-out className="text-light-grey" />
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-8">
              {ROLES.map(([label, v]) => (
                <div key={v} className="flex items-center gap-4">
                  <span
                    data-hex
                    className="size-12"
                    style={{ background: `var(${v})` }}
                  />
                  <span className="type-body-md leading-tight">
                    {label}
                    <br />
                    <span data-hex-out className="text-light-grey" />
                  </span>
                </div>
              ))}
            </div>
          </Block>

          <Block
            title="Space"
            note="Spacing counts base pixels P (2 device pixels on phones, 3 from 40rem): p-6 is 6 P."
          >
            <div className="flex flex-col gap-3">
              {SPACES.map((n) => (
                <div
                  key={n}
                  className="grid grid-cols-[calc(var(--p)*20)_auto_1fr] items-center gap-6 type-body-md"
                >
                  <span>{n} P</span>
                  <span
                    className="h-4 bg-pico-accent"
                    style={{ width: `calc(var(--p) * ${n})` }}
                  />
                  <span data-width className="text-light-grey" />
                </div>
              ))}
            </div>
            <div className="type-body-md text-light-grey">
              Section gaps (fluid, rounded to whole device pixels):{" "}
              <span className="text-cream">--gap-sm</span>,{" "}
              <span className="text-cream">--gap-md</span>,{" "}
              <span className="text-cream">--gap-lg</span>,{" "}
              <span className="text-cream">--section-py</span>.
            </div>
          </Block>

          <Block
            title="Shadow"
            note="Black, down and right, in title pixels. Titles 1; resting cards 1 and floating things 2 on a grown copy; pressables float 1, lift one of their own pixels on hover and sit flush when pressed. Corners step in by one title pixel per 12 of the shorter side, up to 2; only the console keeps growing."
          >
            <div className="flex flex-wrap items-start gap-16">
              <div className="flex flex-col gap-4">
                <Caption>Floating card</Caption>
                <div className="pixel-float pixel-cut">
                  <PixelShadow />
                  <div className="pixel-face card-cream p-8 type-body-md">
                    Card, menu, frame
                  </div>
                </div>
              </div>
              {(
                [
                  ["Rest", "0 0"],
                  ["Hover", "-0.125em -0.125em"],
                  ["Pressed", "var(--s) var(--s)"],
                ] as const
              ).map(([label, translate]) => (
                <div key={label} className="flex flex-col gap-4">
                  <Caption>{label}</Caption>
                  <span className="pixel-button pixel-cut inline-flex">
                    <PixelShadow />
                    <span
                      className="pixel-face card-accent px-6 py-4 type-body-md uppercase tracking-[0.125em]"
                      style={{ translate }}
                    >
                      Button
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Parts" note="The shared components.">
            <div className="flex flex-wrap items-center gap-8">
              <PixelButton href="#" icon="download">
                Button
              </PixelButton>
              <PixelButton href="#" icon="external">
                Link out
              </PixelButton>
              <div className="tone-light flex gap-6 bg-transparent!">
                <button type="button" className={dropdown.trigger}>
                  <PixelShadow />
                  <span
                    className={`${dropdown.triggerFace} gap-6 px-6 type-body-md uppercase tracking-[0.125em]`}
                  >
                    <PixelIcon name="menu" />
                    Menu
                  </span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 type-body-md">
              <span className="pixel-cut pixel-face card-accent px-4 py-2 leading-none">
                Featured chip
              </span>
              <span className="pixel-cut pixel-face card-cream px-4 py-2 leading-none">
                Chip
              </span>
              <span className="pixel-cut pixel-face card-accent flex items-center gap-4 px-4 py-2 uppercase">
                <PixelIcon name="star" />
                Badge
              </span>
            </div>
            <div className="flex flex-wrap gap-4 type-body-md">
              {PIXEL_ICONS.map((name) => (
                <span
                  key={name}
                  title={name}
                  className="flex size-12 items-center justify-center bg-darker-blue"
                >
                  <PixelIcon name={name} />
                </span>
              ))}
            </div>
            <div className="grid gap-12 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <Caption>Menu title bar (divided)</Caption>
                <div className={dropdown.panel}>
                  <PixelShadow />
                  <div className={dropdown.panelFace}>
                    <TitleBar title="Menu title" divider />
                    <p className="px-6 py-4 type-body-md text-black uppercase tracking-[0.125em]">
                      Menu item
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Caption>Window title bar</Caption>
                <TitleBar title="Window title" />
              </div>
            </div>
            <div className="grid items-start gap-16 sm:grid-cols-2">
              <WindowFrame title="Window" tilt={-1}>
                <Placeholder />
              </WindowFrame>
              <ConsoleFrame title="P1" tilt={1} delay={1.5}>
                <Placeholder />
              </ConsoleFrame>
            </div>
          </Block>
        </div>

        {/* Sticky on the wrapper: a sticky card would lift its own shadow. */}
        <div className="sticky top-4 self-start">
          <Tuner />
        </div>
      </div>
    </main>
  );
}
