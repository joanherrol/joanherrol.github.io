---
title: Fifteen Text Styles: Five Roles × lg, md, sm
impact: HIGH
impactDescription: one vocabulary for all text; each class sets font, size, line, case and tracking
tags: type, scale, utilities, responsive
---

## Fifteen Text Styles: Five Roles × lg, md, sm

Glyph pixels are in device pixels, phone / 40rem up (display: / 64rem up). Font size = 8 × value.

| Role     | Font        | Case                   | Line  | lg          | md                              | sm         |
| -------- | ----------- | ---------------------- | ----- | ----------- | ------------------------------- | ---------- |
| display  | Press Start | upper                  | 1     | 7 / 11 / 14 | round(clamp(4.5px, 1vw, 11px))  | 5 / 7 / 10 |
| headline | Press Start | upper                  | 1.125 | 5 / 8       | clamp(3, min(0.475vw, 0.75svh), 7) | 3 / 5   |
| title    | Press Start | as written             | 1.375 | 3 / 4       | 2 / 3                           | 2 / 2      |
| body     | Tiny5       | as written             | 1.375 | 3 / 4       | 2 / 3                           | 2 / 2      |
| label    | Tiny5       | upper, 0.25em tracking | 1     | 3 / 4       | 2 / 3                           | 1 / 1      |

**Incorrect (sizes and fonts scattered across components):**

```tsx
<h2 className="font-pixel text-3xl uppercase leading-tight">…</h2>
```

**Correct (one utility per style; tokens change per breakpoint):**

```css
:root {
  --fp-display-lg: calc(var(--ipx) * 7);
  --fp-display-md: round(clamp(4.5px, 1vw, 11px), var(--ipx));
  --fp-headline-md: round(
    clamp(calc(var(--ipx) * 3), min(0.475vw, 0.75svh), calc(var(--ipx) * 7)),
    var(--ipx)
  );
  --fp-body-md: calc(var(--ipx) * 2);
  --fp-label-sm: calc(var(--ipx) * 1);
  /* …all 15 */
}
@media (width >= 40rem) { :root { --fp-body-md: calc(var(--ipx) * 3); /* … */ } }
@media (width >= 64rem) { :root { --fp-display-lg: calc(var(--ipx) * 14); /* … */ } }

@utility type-headline-md {
  font-family: var(--font-display);
  font-size: calc(var(--fp-headline-md) * 8);
  line-height: 1.125;
  text-transform: uppercase;
}
@utility type-label-md {
  font-family: var(--font-body);
  font-size: calc(var(--fp-label-md) * 8);
  line-height: 1;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}
```

```tsx
<h2 className="relative type-headline-md text-balance"><DropText>…</DropText></h2>
```

Where a component needs its own line height or tracking (buttons, menu rows), use the size-only `text-body` / `text-body-lg` with `leading-none tracking-[0.125em] uppercase`.
