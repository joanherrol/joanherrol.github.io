---
title: Line Heights in Eighths, Tracking in Whole Glyph Pixels
impact: MEDIUM
impactDescription: line boxes and letter gaps land on whole pixels
tags: type, line-height, letter-spacing
---

## Line Heights in Eighths, Tracking in Whole Glyph Pixels

With an 8-pixel em, line heights of 1, 1.125, 1.25, 1.375 or 1.625 give whole-pixel line boxes. Letter spacing is 0.125em or 0.25em (1 or 2 glyph pixels). Headline-md at 1.125 leaves exactly one glyph pixel between lines, room for the 1-pixel shadow. Marked words with a ring use `leading-snug` (1.375) to make room for the ring and its shadow.

**Incorrect:**

```tsx
<p className="leading-[1.4] tracking-[0.05em]">…</p>
```

**Correct:**

```tsx
<p className="type-body-md">…</p>                           {/* 1.375 */}
<span className="uppercase tracking-[0.125em] leading-none">Start</span>
<span className="text-mark leading-snug">clear</span>
```
