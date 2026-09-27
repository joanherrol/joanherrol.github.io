import type { ReactNode } from "react";
import { PixelIcon, type PixelIconName } from "@/components/retro/pixel-icon";

export type Tone = "dark" | "alt";

export function Section({
  id,
  tone,
  edge = true,
  fill = false,
  className = "",
  children,
}: Readonly<{
  id: string;
  tone: Tone;
  edge?: boolean;
  /** Lets children split the section height with flex-1 spacers. */
  fill?: boolean;
  className?: string;
  children: ReactNode;
}>) {
  return (
    <section
      id={id}
      className={`tone-${tone} section-paper relative flex min-h-screen-band flex-col justify-center pt-(--section-pt) pb-(--section-py) pr-[calc(var(--lane)+var(--safe-r))] pl-[calc(var(--lane)+var(--safe-l))] ${edge ? "pixel-edge" : ""} ${className}`}
    >
      <div
        className={`relative mx-auto w-full max-w-384 ${fill ? "flex flex-1 flex-col" : ""}`}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionLabel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p data-reveal className="type-label-md text-light-grey">
      {children}
    </p>
  );
}

function DropText({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <span aria-hidden="true" className="drop-copy">
        {children}
      </span>
      {children}
    </>
  );
}

export function SectionTitle({
  children,
  as: Tag = "h2",
}: Readonly<{
  children: ReactNode;
  as?: "h1" | "h2";
}>) {
  return (
    <Tag
      data-reveal
      className="relative mt-(--gap-sm) type-headline-md text-balance"
    >
      <DropText>{children}</DropText>
    </Tag>
  );
}

export function Mark({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-mark leading-snug">{children}</span>;
}

const buttonClasses =
  "card-accent pixel-float pixel-button inline-flex items-center justify-center gap-3 px-6 py-4 text-body uppercase leading-none tracking-[0.125em] sm:gap-5 sm:px-11 sm:py-8 sm:text-body-lg";

export function PixelButton({
  href,
  children,
  icon,
  external,
  download,
}: Readonly<{
  href: string;
  children: ReactNode;
  icon?: PixelIconName;
  external?: boolean;
  download?: string;
}>) {
  return (
    <a
      href={href}
      className={buttonClasses}
      data-sound="confirm"
      download={download}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {icon && <PixelIcon name={icon} />}
    </a>
  );
}

export const dropdown = {
  trigger:
    "pixel-float pixel-button flex h-[round(up,44px,var(--ipx))] cursor-pointer items-center bg-paper",
  panel: "pixel-float pointer-events-auto mt-6 bg-paper",
  item: "flex w-full cursor-pointer items-center gap-6 whitespace-nowrap px-6 py-4 text-left text-body uppercase leading-none tracking-[0.125em] hover:bg-pico-accent hover:text-cream",
};

const LIGHTS = [
  "bg-red border-dark-red",
  "bg-yellow border-orange",
  "bg-green border-medium-green",
];

export function TitleBar({
  title,
  divider = false,
}: Readonly<{ title: string; divider?: boolean }>) {
  return (
    <div
      className={`flex items-center gap-[0.25em] bg-cream px-[0.5em] py-[0.375em] text-body text-black ${divider ? "border-b-[0.125em] border-light-grey" : ""}`}
    >
      {LIGHTS.map((bg) => (
        <span
          key={bg}
          className={`size-[0.625em] shrink-0 border-[0.125em] ${bg}`}
          aria-hidden="true"
        />
      ))}
      <span className="ml-[0.25em] min-w-0 truncate uppercase tracking-[0.125em]">
        {title}
      </span>
    </div>
  );
}

type FloatProps = Readonly<{
  title: string;
  /** Sway in degrees; the sign picks which way it leans first. */
  tilt?: number;
  /** Seconds into the float cycle, so neighbours drift apart. */
  delay?: number;
  className?: string;
  children: ReactNode;
}>;

function FloatFrame({
  tilt = 1,
  delay = 0,
  className,
  bodyClassName,
  children,
}: Omit<FloatProps, "title"> & Readonly<{ bodyClassName: string }>) {
  return (
    <figure
      data-reveal
      className={`relative ${className}`}
      style={
        {
          "--tilt": `${tilt}deg`,
          "--float-delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      <div aria-hidden="true" className="float-shadow" />
      <div className={`float-body ${bodyClassName}`}>{children}</div>
    </figure>
  );
}

export function WindowFrame({ title, className = "", ...props }: FloatProps) {
  return (
    <FloatFrame {...props} className={className} bodyClassName="bg-cream">
      <TitleBar title={title} />
      {props.children}
    </FloatFrame>
  );
}

export function PixelArt({
  rows,
  colors,
  className = "",
}: Readonly<{
  rows: readonly string[];
  colors: Record<string, string>;
  className?: string;
}>) {
  const paths: Record<string, string> = {};
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== ".") paths[ch] = `${paths[ch] ?? ""}M${x} ${y}h1v1h-1z`;
    }),
  );
  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {Object.entries(paths).map(([ch, d]) => (
        <path key={ch} d={d} fill={colors[ch]} />
      ))}
    </svg>
  );
}

const DPAD = [
  "......hhhhhhh......",
  "......h######......",
  "......h######......",
  "......h######......",
  "......h######......",
  "......h######......",
  "hhhhhh#######hhhhhh",
  "h##################",
  "h#######ddd########",
  "h#######ddd########",
  "h#######ddd########",
  "h##################",
  "h##################",
  "......h######......",
  "......h######......",
  "......h######......",
  "......h######......",
  "......h######......",
  "......h######......",
];
const DPAD_COLORS = {
  "#": "var(--color-black)",
  h: "var(--color-dark-grey)",
  d: "var(--color-dark-grey)",
};

const ROUND_BUTTON = [
  "....aaaaa.....",
  "..aaaaaaaaa...",
  ".aaawwaaaaaa..",
  ".aawaaaaaaaa#.",
  "aaawaaaaaaaaa.",
  "aaaaaaaaaaaaa#",
  "aaaaaaaaaaaaa#",
  "aaaaaaaaaaaaa#",
  "aaaaaaaaaaaaa#",
  ".aaaaaaaaaaa##",
  ".aaaaaaaaaaa#.",
  "..aaaaaaaaa##.",
  "...#aaaaa###..",
  ".....#####....",
];
const BUTTON_COLORS = {
  a: "var(--pico-accent)",
  w: "var(--color-white)",
  "#": "var(--color-black)",
};

// One art pixel per base pixel, so w-19 is exactly 19 of them.
export function ConsoleFrame({ title, className = "", ...props }: FloatProps) {
  return (
    <FloatFrame
      {...props}
      className={className}
      bodyClassName="flex items-center justify-between gap-6 bg-cream px-6 py-8"
    >
      <PixelArt rows={DPAD} colors={DPAD_COLORS} className="w-19 shrink-0" />
      <div className="min-w-0 flex-1 bg-dark-grey px-3 pb-3">
        <div className="flex items-center gap-[0.5em] py-[0.375em] text-body uppercase leading-none tracking-[0.125em] text-cream">
          <span
            className="size-[0.625em] shrink-0 border-[0.125em] border-dark-red bg-red"
            aria-hidden="true"
          />
          {title}
        </div>
        <div className="bg-black pl-(--p) pt-(--p)">{props.children}</div>
      </div>
      <div className="relative size-25 shrink-0">
        <PixelArt
          rows={ROUND_BUTTON}
          colors={BUTTON_COLORS}
          className="absolute bottom-0 left-0 w-14"
        />
        <PixelArt
          rows={ROUND_BUTTON}
          colors={BUTTON_COLORS}
          className="absolute right-0 top-0 w-14"
        />
      </div>
    </FloatFrame>
  );
}
