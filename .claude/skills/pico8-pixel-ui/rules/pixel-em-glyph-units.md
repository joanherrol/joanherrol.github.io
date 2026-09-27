---
title: Size Text-Bound Details in Glyph Pixels (0.125em)
impact: HIGH
impactDescription: borders, gaps and icons inside text match the text's own pixel
tags: pixel, em, icons, borders, text
---

## Size Text-Bound Details in Glyph Pixels (0.125em)

Both fonts draw 8 glyph pixels per em, so `0.125em` is one glyph pixel of the surrounding text. Use eighths of an em for borders, gaps, light squares and icons that live inside a line of text. They then scale with the text and stay whole.

**Incorrect (a 2px border next to 3px glyph pixels looks thin and off-grid):**

```tsx
<span className="size-3 border-2 border-dark-red bg-red" />
```

**Correct:**

```tsx
<div className="flex items-center gap-[0.25em] px-[0.5em] py-[0.375em] text-body">
  <span className="size-[0.625em] border-[0.125em] border-dark-red bg-red" />
  <span className="ml-[0.25em] uppercase tracking-[0.125em]">{title}</span>
</div>
```

Pixel icons are drawn as string rows and rendered at `1em = 8` glyph pixels, so a 7×7 icon is 7 glyph pixels square. Line heights are eighths too: 1, 1.125, 1.25, 1.375, 1.625.
