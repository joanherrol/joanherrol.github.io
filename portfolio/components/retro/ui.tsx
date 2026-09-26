import type { ReactNode } from "react";
import { PixelIcon, type PixelIconName } from "@/components/retro/pixel-icon";

export type Tone = "dark" | "alt";

export function Section({
  id,
  tone,
  edge = true,
  className = "",
  children,
}: Readonly<{
  id: string;
  tone: Tone;
  edge?: boolean;
  className?: string;
  children: ReactNode;
}>) {
  return (
    <section
      id={id}
      className={`tone-${tone} section-paper relative flex min-h-screen-band flex-col justify-center py-(--section-py) px-(--lane) ${edge ? "pixel-edge" : ""} ${className}`}
    >
      <div className="relative mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionLabel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p
      data-reveal
      className="text-body uppercase leading-relaxed tracking-[0.25em] opacity-70"
    >
      {children}
    </p>
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
      // 8 grid units tall; 9px line height leaves a 1px gap between lines.
      className="text-drop mt-(--gap-sm) font-pixel text-[calc(var(--grid)*8)] uppercase leading-[1.125] text-balance"
    >
      {children}
    </Tag>
  );
}

export function Mark({ children }: Readonly<{ children: ReactNode }>) {
  // Taller lines make room for the outline and shadow.
  return <span className="text-mark leading-snug">{children}</span>;
}

const buttonClasses =
  "card-accent inline-flex items-center justify-center gap-1.5 px-3 py-2 text-body uppercase leading-none tracking-[0.125em] sm:gap-2 sm:px-4 sm:py-3 sm:text-large pixel-shadow-2 transition-[translate,box-shadow] duration-100 hover:pixel-lift-1 hover:pixel-shadow-3 sm:border-(length:--px) sm:[--px:calc(var(--ipx)*4)] active:pixel-press-2 active:shadow-none";

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
  download?: boolean;
}>) {
  return (
    <a
      href={href}
      className={buttonClasses}
      download={download || undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {icon && <PixelIcon name={icon} />}
    </a>
  );
}

export const dropdown = {
  trigger:
    "pixel-box pointer-events-auto flex h-[round(44px,var(--text-px))] cursor-pointer items-center border-(length:--text-px) border-black bg-paper pixel-shadow-2 transition-[translate,box-shadow] duration-100 hover:pixel-lift-1 hover:pixel-shadow-3",
  panel:
    "pixel-box pointer-events-auto mt-3 border-(length:--text-px) border-black bg-paper pixel-shadow-3",
  item: "flex w-full cursor-pointer items-center gap-3 whitespace-nowrap px-3 py-2 text-left text-body uppercase tracking-[0.125em] hover:bg-pico-accent hover:text-cream",
};

const LIGHTS = ["bg-[#ff004d]", "bg-[#ffec27]", "bg-[#00e436]"];

export function TitleBar({ title }: Readonly<{ title: string }>) {
  return (
    <div className="flex items-center gap-[0.25em] border-b-[0.125em] border-black bg-cream px-[0.5em] py-[0.375em] text-body text-black">
      {LIGHTS.map((bg) => (
        <span
          key={bg}
          className={`size-[0.625em] shrink-0 border-[0.125em] border-black ${bg}`}
          aria-hidden="true"
        />
      ))}
      <span className="ml-[0.25em] min-w-0 truncate uppercase tracking-[0.125em]">
        {title}
      </span>
    </div>
  );
}

export function WindowFrame({
  title,
  className = "",
  children,
}: Readonly<{
  title: string;
  className?: string;
  children: ReactNode;
}>) {
  return (
    <figure
      data-reveal
      // Black backing hides hairlines on tilted edges.
      className={`border-(length:--text-px) border-black bg-black pixel-shadow-4 ${className}`}
    >
      <TitleBar title={title} />
      {children}
    </figure>
  );
}

export function PixelArt({
  rows,
  colors,
  className = "",
}: Readonly<{
  rows: string[];
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
  "....#####....",
  "....#####....",
  "....#####....",
  "....#####....",
  "#############",
  "#############",
  "#############",
  "#############",
  "#############",
  "....#####....",
  "....#####....",
  "....#####....",
  "....#####....",
];

const ROUND_BUTTON = [
  "..#####..",
  ".#aaaaa#.",
  "#awaaaaa#",
  "#aaaaaaa#",
  "#aaaaaaa#",
  "#aaaaaaa#",
  "#aaaaaaa#",
  ".#aaaaa#.",
  "..#####..",
];
const BUTTON_COLORS = {
  "#": "#000",
  a: "var(--pico-accent)",
  w: "var(--pico-white)",
};

export function ConsoleFrame({
  title,
  className = "",
  children,
}: Readonly<{
  title: string;
  className?: string;
  children: ReactNode;
}>) {
  return (
    <figure data-reveal className={`@container ${className}`}>
      <div className="flex items-center gap-[4cqw] border-(length:--text-px) border-black bg-cream px-[4cqw] py-[5cqw] text-black pixel-shadow-4">
        <PixelArt
          rows={DPAD}
          colors={{ "#": "#000" }}
          className="w-[round(down,14cqw,calc(var(--ipx)*13))] shrink-0"
        />
        <div className="min-w-0 flex-1 border-(length:--text-px) border-black bg-black px-[2.5cqw] pb-[2.5cqw]">
          <div className="flex items-center gap-[1.5cqw] py-[1.5cqw] font-pixel text-[2.5cqw] uppercase leading-none text-cream">
            <span
              className="aspect-square w-[1.5cqw] bg-pico-accent"
              aria-hidden="true"
            />
            {title}
          </div>
          {children}
        </div>
        <div className="relative aspect-square w-[15cqw] shrink-0">
          <PixelArt
            rows={ROUND_BUTTON}
            colors={BUTTON_COLORS}
            className="absolute bottom-[1cqw] left-0 w-[round(down,7cqw,calc(var(--ipx)*9))]"
          />
          <PixelArt
            rows={ROUND_BUTTON}
            colors={BUTTON_COLORS}
            className="absolute right-0 top-[1cqw] w-[round(down,7cqw,calc(var(--ipx)*9))]"
          />
        </div>
      </div>
    </figure>
  );
}
