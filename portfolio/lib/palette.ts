// The 16-colour PICO-8 palette. https://pico-8.fandom.com/wiki/Palette
const PICO8 = {
  darkBlue: "#1d2b53",
  darkGreen: "#008751",
  red: "#ff004d",
} as const;

// PICO-8 secret palette: none of these appear in the sprites.
const PICO8_SECRET = {
  darkerPurple: "#422136",
  blueGreen: "#125359",
  darkBrown: "#742f29",
  darkerGrey: "#49333b",
  darkOrange: "#ff6c24",
  mauve: "#754665",
  peach: "#ff9d81",
  darkPeach: "#ff6e59",
  mediumGreen: "#00b543",
} as const;

export type Palette = {
  id: string;
  name: string;
  bg: string;
  bg2: string;
  accent: string;
};

// Ordered so neighbours never share a background.
export const PALETTES: Palette[] = [
  {
    id: "shootemup",
    name: "Shoot'em",
    bg: PICO8.darkBlue,
    bg2: PICO8.darkGreen,
    accent: PICO8.red,
  },
  {
    id: "moss",
    name: "Moss",
    bg: PICO8_SECRET.darkerGrey,
    bg2: PICO8_SECRET.darkBrown,
    accent: PICO8.darkGreen,
  },
  {
    id: "coral",
    name: "Coral",
    bg: PICO8.darkBlue,
    bg2: PICO8_SECRET.blueGreen,
    accent: PICO8_SECRET.darkPeach,
  },
  {
    id: "plum",
    name: "Plum",
    bg: PICO8_SECRET.darkerGrey,
    bg2: PICO8_SECRET.mauve,
    accent: PICO8_SECRET.peach,
  },
  {
    id: "dusk",
    name: "Dusk",
    bg: PICO8_SECRET.darkerPurple,
    bg2: PICO8_SECRET.darkBrown,
    accent: PICO8_SECRET.darkOrange,
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
