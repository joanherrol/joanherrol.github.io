import type { ReactNode } from "react";
import { PixelIcon, type PixelIconName } from "@/components/retro/pixel-icon";

export type Tone = "dark" | "alt";

export function Section({
  id,
  tone,
  edge = true,
  className = "",
  children,
}: {
  id: string;
  tone: Tone;
  edge?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`tone-${tone} section-paper relative flex min-h-screen-band flex-col justify-center py-(--section-py) pl-(--lane) pr-(--lane-right) ${edge ? "pixel-edge" : ""} ${className}`}
    >
      <div className="relative mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
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
}: {
  children: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <Tag
      data-reveal
      // 8 grid units tall; 9px line height leaves a 1px gap between lines.
      className="text-drop mt-(--gap-sm) font-pixel text-[length:calc(var(--grid)*8)] uppercase leading-[1.125] text-balance"
    >
      {children}
    </Tag>
  );
}

export function Mark({ children }: { children: ReactNode }) {
  // Taller lines make room for the outline and shadow.
  return <span className="text-mark leading-[1.375]">{children}</span>;
}

const buttonClasses =
  "card-accent inline-flex items-center justify-center gap-2 px-4 py-3 text-body uppercase leading-none tracking-wider sm:gap-3 sm:px-5 sm:py-4 sm:text-large shadow-[4px_4px_0_0_#000] transition-[translate,box-shadow] duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

export function PixelButton({
  href,
  children,
  icon,
  external,
  download,
}: {
  href: string;
  children: ReactNode;
  icon?: PixelIconName;
  external?: boolean;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      className={buttonClasses}
      download={download || undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {icon && <PixelIcon name={icon} size={3} />}
    </a>
  );
}

export const dropdown = {
  trigger:
    "pointer-events-auto flex h-[44px] cursor-pointer items-center border-[3px] border-black bg-paper shadow-[3px_3px_0_0_#000] transition-transform hover:-translate-y-[2px]",
  panel:
    "pointer-events-auto mt-3 border-[3px] border-black bg-paper shadow-[6px_6px_0_0_#000]",
  item: "flex w-full cursor-pointer items-center gap-3 whitespace-nowrap px-3 py-2 text-left text-body uppercase tracking-wider hover:bg-pico-accent hover:text-cream",
};

const LIGHTS = ["bg-[#ff004d]", "bg-[#ffec27]", "bg-[#00e436]"];

export function TitleBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b-[3px] border-black bg-cream px-3 py-2 text-black">
      {LIGHTS.map((bg) => (
        <span
          key={bg}
          className={`h-[12px] w-[12px] border-2 border-black ${bg}`}
          aria-hidden="true"
        />
      ))}
      <span className="ml-2 text-body uppercase tracking-widest">{title}</span>
    </div>
  );
}

export function WindowFrame({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure
      data-reveal
      // Black backing hides hairlines on tilted edges.
      className={`border-[3px] border-black bg-black shadow-[10px_10px_0_0_#000] ${className}`}
    >
      <TitleBar title={title} />
      {children}
    </figure>
  );
}

function PixelArt({
  rows,
  colors,
  className = "",
}: {
  rows: string[];
  colors: Record<string, string>;
  className?: string;
}) {
  const paths: Record<string, string> = {};
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== ".") paths[ch] = `${paths[ch] ?? ""}M${x} ${y}h1v1h-1z`;
    }),
  );
  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
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
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure data-reveal className={`[container-type:inline-size] ${className}`}>
      <div className="flex items-center gap-[4cqw] border-[3px] border-black bg-cream px-[4cqw] py-[5cqw] text-black shadow-[10px_10px_0_0_#000]">
        <PixelArt
          rows={DPAD}
          colors={{ "#": "#000" }}
          className="w-[14cqw] shrink-0"
        />
        <div className="min-w-0 flex-1 border-[3px] border-black bg-black px-[2.5cqw] pb-[2.5cqw]">
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
            className="absolute bottom-[1cqw] left-0 w-[7cqw]"
          />
          <PixelArt
            rows={ROUND_BUTTON}
            colors={BUTTON_COLORS}
            className="absolute right-0 top-[1cqw] w-[7cqw]"
          />
        </div>
      </div>
    </figure>
  );
}
