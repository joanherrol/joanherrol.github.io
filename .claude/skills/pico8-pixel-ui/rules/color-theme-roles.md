---
title: Themes Swap Three Roles, Applied Before Paint
impact: HIGH
impactDescription: consistent themes with no flash of the default palette
tags: color, theme, palette, boot-script, localStorage
---

## Themes Swap Three Roles, Applied Before Paint

A theme sets three variables: a muted background, a second background, and one punchy accent. Backgrounds must be colours no sprite uses, so characters never blend in. Each theme's accent is unique, and neighbouring sections never share a background. Pure black is never a background, because black shadows would vanish on it. Themes reference tokens rather than redefining colours, and a saved theme is applied by an inline script before first paint.

**Incorrect (hex copies of the palette, black ground, applied after hydration):**

```ts
{ id: "night", bg: "#000000", bg2: "#111d35", accent: "#29adff" }
useEffect(() => applyPalette(saved), []);
```

**Correct:**

```ts
export const PALETTES = [
  { id: "shootemup", name: "Shoot'em", bg: pico("dark-blue"),     bg2: pico("darker-blue"),   accent: pico("red") },
  { id: "moss",      name: "Moss",     bg: pico("darkest-brown"), bg2: pico("darker-grey"),   accent: pico("dark-green") },
  { id: "midnight",  name: "Midnight", bg: pico("darker-blue"),   bg2: pico("dark-blue"),     accent: pico("blue") },
  { id: "slate",     name: "Slate",    bg: pico("darker-grey"),   bg2: pico("blue-green"),    accent: pico("dark-orange") },
  { id: "synth",     name: "Synth",    bg: pico("darker-blue"),   bg2: pico("darker-purple"), accent: pico("pink") },
];

export function applyPalette(p: Palette) {
  const s = document.documentElement.style;
  s.setProperty("--pico-bg", p.bg);
  s.setProperty("--pico-bg2", p.bg2);
  s.setProperty("--pico-accent", p.accent);
}

// Inlined in <body> so a saved palette applies before first paint.
export const paletteBootScript = `try{var p=localStorage.getItem("pico-palette");var k=${JSON.stringify(
  Object.fromEntries(PALETTES.map((p) => [p.id, [p.bg, p.bg2, p.accent]])),
)}[p];if(k){var s=document.documentElement.style;s.setProperty("--pico-bg",k[0]);s.setProperty("--pico-bg2",k[1]);s.setProperty("--pico-accent",k[2])}}catch(e){}`;
```

```css
.tone-dark  { --paper: var(--pico-bg);  --ink: var(--color-white); }
.tone-alt   { --paper: var(--pico-bg2); --ink: var(--color-white); }
.tone-light { --paper: var(--color-white); --ink: var(--color-black); }
.card-cream  { background-color: var(--color-white); color: var(--color-black); }
.card-accent { background-color: var(--pico-accent); color: var(--color-white); }
```

A palette swatch is just its three colours side by side, with no outline and no separators. On an accent hover row it takes a white outline so its accent chip stays visible.
