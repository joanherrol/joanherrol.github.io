---
title: No Black Outlines, With a Short List of Exceptions
impact: HIGH
impactDescription: separation comes from flat colour, spacing and shadow, not strokes
tags: surface, outline, border, contrast, accessibility
---

## No Black Outlines, With a Short List of Exceptions

Black is for shadows and for solid shapes (a D-pad, text), not for borders, strokes or rings. Avoid coloured outlines too. The allowed exceptions:

- the accent ring around marked title words, which is part of the lettering;
- the keyboard focus ring: accent colour, 1 P wide, offset 1 P;
- a 1-glyph-pixel outline on small colour samples that need contrast:
  - lights take a darker shade of their own hue: red in dark-red, yellow in orange, green in medium-green;
- a palette swatch on a hovered menu row takes a 1-glyph-pixel white outline, because its accent chip would merge with the accent row. At rest it has no outline or separators;
- a muted inner divider where two same-coloured surfaces meet, such as a light-grey line under a menu's cream title bar. There is no divider where the bar sits on a picture.

**Incorrect:**

```tsx
<div className="border-2 border-black bg-cream">…</div>
<span className="size-[0.625em] border-[0.125em] border-black bg-yellow" />
```

**Correct:**

```tsx
const LIGHTS = ["bg-red border-dark-red", "bg-yellow border-orange", "bg-green border-medium-green"];
<span className={`size-[0.625em] border-[0.125em] ${light}`} />

{/* A palette swatch: three flat chips side by side; white outline only on the accent hover row. */}
<button className={`group ${dropdown.item}`}>
  <PixelArt
    rows={Array.from({ length: 6 }, () => "bbbbbbggggggaaaaaa")}
    colors={{ b: p.bg, g: p.bg2, a: p.accent }}
    className="w-[2.25em] outline-cream group-hover:outline-solid group-hover:outline-[0.125em]"
  />
  {p.name}
</button>
```

```css
:focus-visible { outline: var(--p) solid var(--pico-accent); outline-offset: var(--p); }
```
