// The 16-colour PICO-8 palette. https://pico-8.fandom.com/wiki/Palette
const PICO8 = {
  black: "#000000",
  darkBlue: "#1d2b53",
  darkPurple: "#7e2553",
  darkGreen: "#008751",
  brown: "#ab5236",
  darkGrey: "#5f574f",
  lightGrey: "#c2c3c7",
  white: "#fff1e8",
  red: "#ff004d",
  orange: "#ffa300",
  yellow: "#ffec27",
  green: "#00e436",
  blue: "#29adff",
  lavender: "#83769c",
  pink: "#ff77a8",
  peach: "#ffccaa",
} as const;

// The 16 secret PICO-8 colours.
const PICO8_SECRET = {
  darkestBrown: "#291814",
  darkerBlue: "#111d35",
  darkerPurple: "#422136",
  blueGreen: "#125359",
  darkBrown: "#742f29",
  darkerGrey: "#49333b",
  mediumGrey: "#a28879",
  lightYellow: "#f3ef7d",
  darkRed: "#be1250",
  darkOrange: "#ff6c24",
  limeGreen: "#a8e72e",
  mediumGreen: "#00b543",
  trueBlue: "#065ab5",
  mauve: "#754665",
  darkPeach: "#ff6e59",
  lightPeach: "#ff9d81",
} as const;

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
    bg: PICO8.darkBlue,
    bg2: PICO8_SECRET.darkerBlue,
    accent: PICO8.red,
  },
  {
    id: "moss",
    name: "Moss",
    bg: PICO8_SECRET.darkestBrown,
    bg2: PICO8_SECRET.darkerGrey,
    accent: PICO8.darkGreen,
  },
  {
    id: "midnight",
    name: "Midnight",
    bg: PICO8_SECRET.darkerBlue,
    bg2: PICO8.darkBlue,
    accent: PICO8.blue,
  },
  {
    id: "slate",
    name: "Slate",
    bg: PICO8_SECRET.darkerGrey,
    bg2: PICO8_SECRET.blueGreen,
    accent: PICO8_SECRET.darkOrange,
  },
  {
    id: "synth",
    name: "Synth",
    bg: PICO8_SECRET.darkerBlue,
    bg2: PICO8_SECRET.darkerPurple,
    accent: PICO8.pink,
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
