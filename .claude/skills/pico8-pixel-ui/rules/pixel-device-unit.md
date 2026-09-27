---
title: Define One Device-Aligned Pixel (--ipx)
impact: CRITICAL
impactDescription: prevents blurry glyphs and seams at 125%, 150% and 175% zoom
tags: pixel, dpr, zoom, boot-script
---

## Define One Device-Aligned Pixel (--ipx)

`1px` in CSS is not one device pixel once the page is zoomed or the screen has a fractional ratio. Set `--ipx` to the CSS length of one whole device pixel before first paint, and again on zoom (zoom fires `resize`). Every other length is built from it.

**Incorrect (1px is 1.25 device pixels at 125% zoom, so 3px renders as 3.75):**

```css
:root { --unit: 1px; }
.card { padding: calc(var(--unit) * 3); }
```

**Correct (a blocking inline script sets it before paint):**

```ts
// lib/pixel.ts
export const pixelBootScript = `(function(){var r=document.documentElement;function s(){var d=window.devicePixelRatio||1;r.style.setProperty("--ipx",Math.max(1,Math.round(d))/d+"px")}s();addEventListener("resize",s)})()`;

/** One art pixel: about 1px, snapped to a whole number of device pixels. */
export function artPx() {
  const d = window.devicePixelRatio || 1;
  return Math.max(1, Math.round(d)) / d;
}

/** The nearest length that covers a whole number of device pixels. */
export function devicePx(px: number) {
  const d = window.devicePixelRatio || 1;
  return Math.round(px * d) / d;
}
```

```tsx
// app/layout.tsx, first thing in <body>
<script dangerouslySetInnerHTML={{ __html: pixelBootScript }} />
```

```css
:root { --ipx: 1px; } /* fallback until the script runs */
```

`round(dpr) / dpr` gives 1px at 1×, 0.8px at 1.25× (one device pixel is 0.8 CSS px), and 1px at 2× (one art pixel is two device pixels on retina, still whole).
