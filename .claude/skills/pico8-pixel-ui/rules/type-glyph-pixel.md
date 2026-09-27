---
title: Font Size Is Always 8 Whole Glyph Pixels
impact: CRITICAL
impactDescription: crisp pixel fonts at every size; no half-pixel strokes
tags: type, fonts, tokens, antialiasing
---

## Font Size Is Always 8 Whole Glyph Pixels

Use two 8-pixel-em bitmap fonts: **Press Start 2P** (display, headline, title) and **Tiny5** (body, label). Every text style has a glyph-pixel token `--fp-<style>-<size>` made of whole device pixels, and its font size is 8 times that. Switch weights off (a synthetic bold smears pixels), disable font smoothing, and use one style per text element.

**Incorrect:**

```css
p { font-size: 15px; font-weight: 700; }
```

**Correct:**

```tsx
import { Press_Start_2P, Tiny5 } from "next/font/google";
const display = Press_Start_2P({ variable: "--font-display", weight: "400", subsets: ["latin"] });
const body = Tiny5({ variable: "--font-body", weight: "400", subsets: ["latin"] });
```

```css
@theme inline {
  --font-*: initial;
  --font-sans: var(--font-body);
  --font-pixel: var(--font-display);
  --font-weight-*: initial;
  --text-*: initial;
  --text-body: calc(var(--fp-body-md) * 8);
  --text-body-lg: calc(var(--fp-body-lg) * 8);
}
body {
  -webkit-font-smoothing: none;
  font-smooth: never;
}
```

Reading text never goes below 2 device pixels per glyph pixel (16px). Only label-sm, for tiny tags, drops to 1.
