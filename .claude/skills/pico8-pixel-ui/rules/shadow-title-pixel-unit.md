---
title: Draw Every Shadow in Title Pixels (--s)
impact: CRITICAL
impactDescription: one consistent shadow weight across the whole page
tags: shadow, tokens, consistency
---

## Draw Every Shadow in Title Pixels (--s)

All shadows are black, fall down and to the right, and are measured in `--s`, the glyph pixel of headline-md, whatever the element's own pixel size. Small text, big cards and buttons all cast the same weight of shadow.

There are two exceptions, both relative to the element's own pixel:

- Lettering bigger than a title (a hero name) casts 1 of its own glyph pixels, so its shadow stays in proportion.
- A pressable's hover lift is 1 of its own text pixels (see `press-float-raise`).

**Incorrect (shadows follow each element's size, so they differ everywhere):**

```css
.card { box-shadow: 0.5rem 0.5rem 0 black; }
.small-chip { box-shadow: 2px 2px 0 black; }
```

**Correct:**

```css
:root {
  --s: var(--fp-headline-md); /* the shadow pixel */
  --px: var(--fp-body-md);    /* the element's own pixel, text by default */
}
```

```tsx
{/* Display-size hero: its own glyph pixel */}
<h1 className="relative type-display-md [--s:0.125em]">…</h1>
```
