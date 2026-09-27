// Colours come from the PICO-8 tokens in globals.css, never as hex here.
type PicoColor =
  | "black"
  | "dark-blue"
  | "dark-purple"
  | "dark-green"
  | "brown"
  | "dark-grey"
  | "light-grey"
  | "white"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "lavender"
  | "pink"
  | "peach"
  | "darkest-brown"
  | "darker-blue"
  | "darker-purple"
  | "blue-green"
  | "dark-brown"
  | "darker-grey"
  | "medium-grey"
  | "light-yellow"
  | "dark-red"
  | "dark-orange"
  | "lime-green"
  | "medium-green"
  | "true-blue"
  | "mauve"
  | "dark-peach"
  | "light-peach";

const pico = (name: PicoColor) => `var(--color-${name})`;

export type Palette = {
  id: string;
  name: string;
  bg: string;
  bg2: string;
  accent: string;
};

// Backgrounds are muted colours no sprite uses, so characters never blend in;
// each accent is punchy and unique. Neighbours never share a background.
export const PALETTES: Palette[] = [
  {
    id: "shootemup",
    name: "Shoot'em",
    bg: pico("dark-blue"),
    bg2: pico("darker-blue"),
    accent: pico("red"),
  },
  {
    id: "moss",
    name: "Moss",
    bg: pico("darkest-brown"),
    bg2: pico("darker-grey"),
    accent: pico("dark-green"),
  },
  {
    id: "midnight",
    name: "Midnight",
    bg: pico("darker-blue"),
    bg2: pico("dark-blue"),
    accent: pico("blue"),
  },
  {
    id: "slate",
    name: "Slate",
    bg: pico("darker-grey"),
    bg2: pico("blue-green"),
    accent: pico("dark-orange"),
  },
  {
    id: "synth",
    name: "Synth",
    bg: pico("darker-blue"),
    bg2: pico("darker-purple"),
    accent: pico("pink"),
  },
];

export const DEFAULT_PALETTE = PALETTES[0];
export const PALETTE_STORAGE_KEY = "pico-palette";

export function applyPalette(p: Palette) {
  const s = document.documentElement.style;
  s.setProperty("--pico-bg", p.bg);
  s.setProperty("--pico-bg2", p.bg2);
  s.setProperty("--pico-accent", p.accent);
}

// Inlined in <body> so a saved palette applies before first paint.
export const paletteBootScript = `try{var p=localStorage.getItem("${PALETTE_STORAGE_KEY}");var k=${JSON.stringify(
  Object.fromEntries(PALETTES.map((p) => [p.id, [p.bg, p.bg2, p.accent]])),
)}[p];if(k){var s=document.documentElement.style;s.setProperty("--pico-bg",k[0]);s.setProperty("--pico-bg2",k[1]);s.setProperty("--pico-accent",k[2])}}catch(e){}`;
