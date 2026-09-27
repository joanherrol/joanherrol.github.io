---
title: Build Every Length From Whole Device Pixels
impact: CRITICAL
impactDescription: the single overriding rule; any fractional length breaks the pixel look
tags: pixel, css, round, clamp, fluid
---

## Build Every Length From Whole Device Pixels

Fixed lengths are `calc(var(--ipx) * n)` with integer `n`. Fluid lengths that follow the viewport are snapped with CSS `round(value, var(--ipx))`. Layout widths (column fractions, percentages, `max-width` caps) may be fluid, but anything drawn inside them keeps whole pixels.

**Incorrect (rem and vw produce fractional device pixels):**

```css
h2 { font-size: 2.2rem; }
.gap { gap: 1.5vw; }
.border { border-width: 0.1em; }
```

**Correct:**

```css
:root {
  --gap-md: round(clamp(1rem, 3svh, 2rem), var(--ipx));
  --fp-headline-md: round(
    clamp(calc(var(--ipx) * 3), min(0.475vw, 0.75svh), calc(var(--ipx) * 7)),
    var(--ipx)
  );
}
.min-tap { height: round(up, 44px, var(--ipx)); }
```

`em` is fine only when the em itself is whole pixels: in text whose font size is 8 × a whole glyph pixel, `0.125em` is exactly one glyph pixel (see `pixel-em-glyph-units`).
