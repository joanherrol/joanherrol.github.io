---
title: Count Spacing in Base Pixels (P)
impact: CRITICAL
impactDescription: keeps every gap and padding on the pixel grid and scales them by whole steps
tags: pixel, spacing, tailwind, property
---

## Count Spacing in Base Pixels (P)

The base pixel `--p` is 2 device pixels on phones and 3 from 40rem. Point Tailwind's spacing scale at it so `p-6` means 6 P. Register `--p` as a `<length>` so scripts can read its resolved value.

**Incorrect (Tailwind's default 0.25rem step is 4px, not a device multiple at every zoom):**

```css
@import "tailwindcss";
```

**Correct:**

```css
@property --p {
  syntax: "<length>";
  inherits: true;
  initial-value: 2px;
}
@theme inline {
  --spacing: var(--p);
}
:root { --p: calc(var(--ipx) * 2); }
@media (width >= 40rem) {
  :root { --p: calc(var(--ipx) * 3); }
}
```

```ts
/** The base pixel P in CSS px, from the registered --p. */
export function basePx() {
  const root = document.documentElement;
  return Number.parseFloat(getComputedStyle(root).getPropertyValue("--p")) || 2;
}
```

Arbitrary spacing is `calc(var(--p) * n)`. Hand-drawn UI art (a D-pad, console buttons) is drawn one art pixel per P, so `w-19` is exactly 19 art pixels. For a React value that follows resize, wrap `basePx` in `useSyncExternalStore` with a server snapshot of `0`, in its own client module.
